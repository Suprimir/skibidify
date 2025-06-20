import { Play, Shuffle, Music } from "lucide-react";
import HeaderPlaylist from "./HeaderPlaylist";
import SongCard from "../SongCard";
import { useSongs } from "@/contexts/song";
import { usePlayer } from "@/contexts/player";
import { type Playlist, type Song } from "@/types/Song";
import { useEffect, useState } from "react";

interface PlaylistViewProps {
  id: string;
}

const playlistDefault: Playlist = {
  id: "",
  image: "",
  name: "",
  songs: [""],
};

export default function PlaylistView({ id }: PlaylistViewProps) {
  const [playlist, setPlaylist] = useState<Playlist>(playlistDefault);
  const [songsInPlaylist, setSongsInPlaylist] = useState<Song[]>([]);
  const { playlists, songs } = useSongs();
  const { setQueue, setShuffleQueue } = usePlayer();

  useEffect(() => {
    if (!id) {
      return;
    }

    const foundPlaylist = playlists.find((p) => p.id === id);
    if (!foundPlaylist) {
      return;
    }

    setPlaylist(foundPlaylist);

    const foundSongs: Song[] = foundPlaylist.songs
      .map((songId) => songs.find((s) => s.id === songId))
      .filter((s): s is Song => s !== undefined);

    setSongsInPlaylist(foundSongs);
  }, [id, playlists, songs]);

  if (!playlist.id) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Music className="w-16 h-16 sm:w-20 sm:h-20 text-primary-300 mx-auto mb-4" />
          <p className="text-lg sm:text-xl text-primary-500 font-medium">
            Playlist not found
          </p>
          <p className="text-sm sm:text-base text-primary-400 mt-2">
            The playlist you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <HeaderPlaylist key={playlist.id} playlist={playlist} />
      </div>

      {songsInPlaylist.length > 0 && (
        <div className="flex gap-3 sm:gap-4 items-center justify-center sm:justify-start mb-6">
          <button
            onClick={() => setQueue(songsInPlaylist)}
            className="cursor-pointer text-primary-50 bg-primary-400 hover:bg-primary-600 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`Play all songs in ${playlist.name}`}
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
          </button>
          <button
            onClick={() => setShuffleQueue(songsInPlaylist)}
            className="cursor-pointer text-primary-500 bg-primary-200 hover:bg-primary-300 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            aria-label={`Shuffle all songs in ${playlist.name}`}
          >
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <div className="pb-8 space-y-1 sm:space-y-2">
        {songsInPlaylist.length > 0 ? (
          songsInPlaylist.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              context="playlist"
              playlistId={playlist.id}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 sm:w-20 sm:h-20 text-primary-300 mx-auto mb-4" />
            <p className="text-lg sm:text-xl text-primary-500 font-medium">
              This playlist is empty
            </p>
            <p className="text-sm sm:text-base text-primary-400 mt-2">
              Add some songs to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
