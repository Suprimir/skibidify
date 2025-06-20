import type { Song } from "@/types/Song";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PlayerContext, type PlayerContextType } from "./playerContext";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songQueue, setSongQueue] = useState<Song[] | null>(() => {
    const storedQueue = localStorage.getItem("playerSongQueue");
    return storedQueue ? (JSON.parse(storedQueue) as Song[]) : null;
  });

  const [songPlaying, setSongPlaying] = useState<Song | null>(() => {
    const storedSongPlaying = localStorage.getItem("playerSongPlaying");
    return storedSongPlaying ? (JSON.parse(storedSongPlaying) as Song) : null;
  });

  const [volume, setVolumeState] = useState<number>(() => {
    const storedVolume = localStorage.getItem("playerVolume");
    return storedVolume ? parseFloat(storedVolume) : 0.5;
  });

  const [currentTime, setCurrentTime] = useState(() => {
    const storedPlayerCurrentTime = localStorage.getItem("playerCurrentTime");
    return storedPlayerCurrentTime ? parseFloat(storedPlayerCurrentTime) : 0;
  });

  const [duration, setDuration] = useState<number>(0);
  const [paused, setPaused] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const isInitialLoad = useRef(true);

  // Función para limpiar el localStorage del player
  const clearPlayerStorage = useCallback(() => {
    localStorage.removeItem("playerSongQueue");
    localStorage.removeItem("playerSongPlaying");
    localStorage.removeItem("playerCurrentTime");
  }, []);

  // Función para limpiar completamente el queue
  const clearQueue = useCallback(() => {
    const audio = audioRef.current;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    setSongQueue(null);
    setSongPlaying(null);
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);

    clearPlayerStorage();
  }, [clearPlayerStorage]);

  /* 
    Sincronizacion de las variables con localStorage
  */
  useEffect(() => {
    if (songQueue && songQueue.length > 0) {
      localStorage.setItem("playerSongQueue", JSON.stringify(songQueue));
    } else if (songQueue === null || songQueue.length === 0) {
      localStorage.removeItem("playerSongQueue");
    }
  }, [songQueue]);

  useEffect(() => {
    if (songPlaying) {
      localStorage.setItem("playerSongPlaying", JSON.stringify(songPlaying));
    } else {
      localStorage.removeItem("playerSongPlaying");
    }
  }, [songPlaying]);

  useEffect(() => {
    localStorage.setItem("playerVolume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("playerCurrentTime", currentTime.toString());
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isInitialLoad.current && audioRef.current && songPlaying) {
      audioRef.current.src = songPlaying.filePath;
      audioRef.current.currentTime = currentTime;
      audioRef.current.pause();
      isInitialLoad.current = false;
    }
  }, [songPlaying, currentTime]);

  /*
    Funciones para manejar el player
  */
  const handlePlay = useCallback((song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = song.filePath;
    audio.load();
    audio.currentTime = 0;

    setSongPlaying(song);
    setCurrentTime(0);
    setPaused(false);

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setPaused(true);
    });
  }, []);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    if (!songQueue || !songPlaying) return;

    const currentIndex = songQueue.findIndex((s) => s.id === songPlaying.id);
    const nextSong = songQueue[currentIndex + 1];

    if (nextSong) {
      handlePlay(nextSong);
    } else {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setPaused(true);
      setSongPlaying(null);
      setCurrentTime(0);
      setDuration(0);

      clearQueue();
      clearPlayerStorage();
    }
  }, [songQueue, songPlaying, handlePlay, clearPlayerStorage, clearQueue]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!songQueue || !songPlaying || !audio) return;

    const currentIndex = songQueue.findIndex((s) => s.id === songPlaying.id);

    if (audio.currentTime > 30 || currentIndex <= 0) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prevSong = songQueue[currentIndex - 1];
      if (prevSong) {
        handlePlay(prevSong);
      }
    }
  }, [songQueue, songPlaying, handlePlay]);

  // Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    const handleTimeUpdate = () => {
      const newCurrentTime = audio.currentTime;
      setCurrentTime(newCurrentTime);
    };

    const handleMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [playNext, songPlaying]);

  const setVolume = (value: number) => {
    setVolumeState(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const setQueue = useCallback(
    (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }

      setSongQueue(songs);
      if (songs.length > 0) {
        handlePlay(songs[0]);
      }
    },
    [handlePlay, clearQueue]
  );

  const setShuffleQueue = useCallback(
    (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }

      const shuffledSongs = [...songs];
      for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [
          shuffledSongs[j],
          shuffledSongs[i],
        ];
      }

      setQueue(shuffledSongs);
    },
    [setQueue, clearQueue]
  );

  const handlePause = () => {
    if (!audioRef.current.src) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPaused(false);
    } else {
      audioRef.current.pause();
      setPaused(true);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value: PlayerContextType = {
    handlePlay,
    setQueue,
    setShuffleQueue,
    handlePause,
    handleSeek,
    setVolume,
    playNext,
    playPrev,
    clearQueue,
    duration,
    paused,
    currentTime,
    songPlaying,
    volume,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
