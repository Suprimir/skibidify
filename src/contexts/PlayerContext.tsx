import type { Song } from "@Types/Song";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PlayerContextType {
  handlePlay: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
  handlePause: () => void;
  handleSeek: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrev: () => void;
  duration: number;
  paused: boolean;
  currentTime: number;
  songPlaying: Song | null;
  volume: number;
}

const defaultPlayerContext: PlayerContextType = {
  handlePlay: () => {},
  setQueue: () => {},
  handlePause: () => {},
  handleSeek: () => {},
  setVolume: () => {},
  playNext: () => {},
  playPrev: () => {},
  duration: 0,
  paused: true,
  currentTime: 0,
  songPlaying: null,
  volume: 0.5,
};

const PlayerContext = createContext<PlayerContextType>(defaultPlayerContext);

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [songQueue, setSongQueue] = useState<Song[] | null>(null);
  const [songPlaying, setSongPlaying] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [paused, setPaused] = useState(true);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(new Audio());

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
    }
  }, [songQueue, songPlaying]);

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
  }, [songQueue, songPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
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
  }, [playNext]);

  const setVolume = (value: number) => {
    setVolumeState(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handlePlay = (song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = song.filePath;
    audio.load();
    audio.volume = volume;

    setSongPlaying(song);
    setPaused(false);

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setPaused(true);
    });
  };

  const setQueue = (songs: Song[]) => {
    setSongQueue(songs);
    if (songs.length > 0) {
      handlePlay(songs[0]);
    }
  };

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
    handlePause,
    handleSeek,
    setVolume,
    playNext,
    playPrev,
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

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer debe usarse dentro de <PlayerContextProvider>");
  }
  return context;
}
