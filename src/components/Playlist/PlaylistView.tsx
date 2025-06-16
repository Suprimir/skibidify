import { Play } from "lucide-react";
import HeaderPlaylist from "./HeaderPlaylist";
import SongCard from "../SongCard";
import { useSongs } from "@Contexts/SongContext";
import { usePlayer } from "@Contexts/PlayerContext";
import { type Playlist, type Song } from "@Types/Song";
import { useEffect, useState } from "react";

interface PlaylistViewProps {
  id: string;
}

const playlistDefault: Playlist = {
  id: "",
  name: "",
  songs: [""],
};

export default function PlaylistView({ id }: PlaylistViewProps) {
  const [playlist, setPlaylist] = useState<Playlist>(playlistDefault);
  const [songsInPlaylist, setSongsInPlaylist] = useState<Song[]>([]);
  const { playlists, songs } = useSongs();
  const { setQueue } = usePlayer();

  useEffect(() => {
    if (!id) return;

    const playlist = playlists.find((p) => p.id === id);
    if (!playlist) return;

    setPlaylist(playlist);

    const foundSongs: Song[] = playlist.songs
      .map((songId) => songs.find((s) => s.id === songId))
      .filter((s): s is Song => s !== undefined);

    setSongsInPlaylist(foundSongs);
  }, [id, playlists, songs]);

  return (
    <div>
      <HeaderPlaylist
        playlistTitle={playlist.name}
        playlistTotalSongs={playlist.songs.length}
      />
      <button
        onClick={() => setQueue(songsInPlaylist)}
        className="cursor-pointer text-primary-50 bg-primary-400 hover:bg-primary-600 w-16 h-16 flex items-center justify-center my-4 rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-100"
      >
        <Play className="w-8 h-8" />
      </button>
      <div className="pb-8">
        {songsInPlaylist.map((song) => (
          <div key={song.id} className="pb-2">
            <SongCard song={song} />
          </div>
        ))}{" "}
      </div>
    </div>
  );
}
