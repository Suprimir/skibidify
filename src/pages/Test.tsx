import type { Song } from "@Types/Song";
import { useEffect, useState } from "react";
import SearchView from "src/components/SearchResults/SearchView";
import SongCard from "src/components/SongCard";

export default function Test() {
  const [songs, setSongs] = useState<Song[]>();

  useEffect(() => {
    const loadSongs = async () => {
      const res = await fetch("/api/songs");
      const data: Song[] = await res.json();

      setSongs(data);
    };

    loadSongs();
  }, []);

  return (
    <>
      <SearchView />
      {songs?.map((song) => (
        <SongCard song={song} />
      ))}
    </>
  );
}
