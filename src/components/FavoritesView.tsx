import { Heart, Play, Shuffle } from "lucide-react";
import SongCard from "./SongCard";
import { useSongs } from "@/contexts/song";
import { usePlayer } from "@/contexts/player";

export default function FavoritesView() {
  const { songs } = useSongs();
  const { setQueue, setShuffleQueue } = usePlayer();

  return (
    <div>
      <div className="flex items-center w-full border shadow-lg bg-primary-100 rounded-2xl border-primary-200/50 backdrop-blur-sm">
        <div className="flex items-center justify-center w-24 h-24 m-6 transition-all border shadow-md sm:w-36 sm:h-36 rounded-3xl bg-primary-300/70 hover:bg-primary-300/50 border-primary-200/50 backdrop-blur-sm">
          <Heart className="w-16 h-16 transition-all text-primary-600 sm:w-24 sm:h-24 drop-shadow-sm" />
        </div>
        <div>
          <h1 className="mx-4 text-4xl sm:text-6xl font-bold text-primary-800 drop-shadow-md">
            Favorites
          </h1>
          <p className="mx-4 text-lg font-semibold transition text-primary-600 sm:text-2xl drop-shadow-sm">
            {songs.filter((song) => song.favorite === true).length} songs
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setQueue(songs)}
          className="cursor-pointer text-primary-50 bg-primary-400 hover:bg-primary-600 w-16 h-16 flex items-center justify-center my-4 rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-100"
        >
          <Play className="w-8 h-8" />
        </button>
        <button
          onClick={() => setShuffleQueue(songs)}
          className="cursor-pointer text-primary-500 bg-primary-200 hover:bg-primary-300 w-12 h-12 flex items-center justify-center my-4 rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-600"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      <div className="pb-8">
        {songs
          .filter((song) => song.favorite === true)
          .map((song) => (
            <div key={song.id} className="pb-2">
              <SongCard song={song} context="favorites" />
            </div>
          ))}
      </div>
    </div>
  );
}
