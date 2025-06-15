import type { Song } from "@Types/Song";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PlayerContextType {
  handlePlay: (song: Song) => void;
  handlePause: () => void;
  handleSeek: (time: number) => void;
  setVolume: (volume: number) => void;
  duration: number;
  paused: boolean;
  currentTime: number;
  songPlaying: Song | null;
  volume: number;
}

const defaultPlayerContext: PlayerContextType = {
  handlePlay: () => {},
  handlePause: () => {},
  handleSeek: () => {},
  setVolume: () => {},
  duration: 0,
  paused: true,
  currentTime: 0,
  songPlaying: null,
  volume: 0.5,
};

const PlayerContext = createContext<PlayerContextType>(defaultPlayerContext);

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [songPlaying, setSongPlaying] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [paused, setPaused] = useState(true);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setVolume = (value: number) => {
    setVolumeState(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handlePlay = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(song.filePath);
    audioRef.current = newAudio;
    setSongPlaying(song);
    setPaused(false);
    newAudio.volume = volume;

    newAudio.addEventListener("loadedmetadata", () => {
      setDuration(newAudio.duration);
    });

    newAudio.addEventListener("ended", () => {
      setPaused(true);
      setCurrentTime(0);
    });

    newAudio.play().catch((err) => {
      console.error("Playback failed:", err);
      setPaused(true);
    });
  };

  const handlePause = () => {
    if (!audioRef.current) return;
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [songPlaying]);

  const value: PlayerContextType = {
    handlePlay,
    handlePause,
    handleSeek,
    setVolume,
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
