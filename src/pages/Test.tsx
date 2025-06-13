import type { Song } from "@Types/Song";
import { useEffect, useRef, useState } from "react";
import PlayerBar from "src/components/PlayerBar";
import SearchView from "src/components/SearchResults/SearchView";
import SongCard from "src/components/SongCard";

export default function Test() {
  const [songs, setSongs] = useState<Song[]>();
  const [volume, setVolume] = useState<number>(0.5);
  const [songPlaying, setSongPlaying] = useState<string>();
  const [pause, setPause] = useState(false);
  const [duration, setDuration] = useState<number>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadSongs = async () => {
      const res = await fetch("/api/songs");
      const data: Song[] = await res.json();
      setSongs(data);
    };

    loadSongs();
  }, []);

  useEffect(() => {
    if (!songPlaying) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(songPlaying);
    newAudio.volume = volume;
    setDuration(newAudio.duration);
    setPause(true);
    newAudio.play();

    audioRef.current = newAudio;

    return () => {
      newAudio.pause();
      setDuration(newAudio.duration);
      setPause(false);
    };
  }, [songPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      console.log(volume);
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePause = () => {
    if (audioRef.current?.paused) {
      setPause(true);
      audioRef.current.play();
    } else {
      setPause(false);
      audioRef.current?.pause();
    }
  };

  return (
    <>
      <SearchView />
      {songs?.map((song) => (
        <div className="my-2">
          <SongCard
            key={song.id}
            song={song}
            setSongPlaying={(songFilePath) => setSongPlaying(songFilePath)}
          />
        </div>
      ))}
      <PlayerBar
        changeVolume={setVolume}
        handlePause={handlePause}
        paused={pause}
        duration={duration ? duration : 0}
      />
    </>
  );
}
