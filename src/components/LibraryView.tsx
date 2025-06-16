import { Play } from "lucide-react";
import SongCard from "./SongCard";
import HeaderPlaylist from "./Playlist/HeaderPlaylist";
import { useSongs } from "@Contexts/SongContext";
import { usePlayer } from "@Contexts/PlayerContext";

export default function LibraryView() {
  const { songs } = useSongs();
  const { setQueue } = usePlayer();

  return (
    <div>
      <HeaderPlaylist
        playlistTitle="Library"
        playlistTotalSongs={songs.length}
      />

      <button
        onClick={() => setQueue(songs)}
        className="cursor-pointer text-primary-50 bg-primary-400 hover:bg-primary-600 w-16 h-16 flex items-center justify-center my-4 rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-100"
      >
        <Play className="w-8 h-8" />
      </button>

      <div className="pb-8">
        {songs.map((song) => (
          <div key={song.id} className="pb-2">
            <SongCard song={song} />
          </div>
        ))}
      </div>
    </div>
  );
}
