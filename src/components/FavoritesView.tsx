import { Heart, Play, Shuffle } from "lucide-react";
import SongCard from "./SongCard";
import { useSongs } from "@/contexts/song";
import { usePlayer } from "@/contexts/player";

export default function FavoritesView() {
  const { songs } = useSongs();
  const { setQueue, setShuffleQueue } = usePlayer();

  const favoriteSongs = songs.filter((song) => song.favorite === true);

  return (
    <div className="p-4 w-full">
      <div className="flex flex-col sm:flex-row items-center w-full border shadow-lg bg-primary-100 rounded-2xl border-primary-200/50 backdrop-blur-sm mb-6">
        <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 m-4 sm:m-6 transition-all border shadow-md rounded-3xl bg-primary-300/70 hover:bg-primary-300/50 border-primary-200/50 backdrop-blur-sm flex-shrink-0">
          <Heart className="w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 transition-all text-primary-600 drop-shadow-sm" />
        </div>

        <div className="text-center sm:text-left px-4 pb-4 sm:p-0">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary-800 drop-shadow-md mb-1 sm:mb-2">
            Favorites
          </h1>
          <p className="text-base sm:text-lg lg:text-2xl font-semibold transition text-primary-600 drop-shadow-sm">
            {favoriteSongs.length}{" "}
            {favoriteSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {favoriteSongs.length > 0 && (
        <div className="flex gap-3 sm:gap-4 items-center justify-center sm:justify-start mb-6">
          <button
            onClick={() => setQueue(favoriteSongs)}
            className="cursor-pointer text-primary-50 bg-primary-400 hover:bg-primary-600 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Play all favorite songs"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
          </button>
          <button
            onClick={() => setShuffleQueue(favoriteSongs)}
            className="cursor-pointer text-primary-500 bg-primary-200 hover:bg-primary-300 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:scale-105 transition-all shadow-lg hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            aria-label="Shuffle all favorite songs"
          >
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <div className="pb-8 space-y-1 sm:space-y-2">
        {favoriteSongs.length > 0 ? (
          favoriteSongs.map((song) => (
            <SongCard key={song.id} song={song} context="favorites" />
          ))
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-primary-300 mx-auto mb-4" />
            <p className="text-lg sm:text-xl text-primary-500 font-medium">
              No favorite songs yet
            </p>
            <p className="text-sm sm:text-base text-primary-400 mt-2">
              Heart some songs to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
