import { Library } from "lucide-react";

interface HeaderPlaylistProps {
  playlistTitle: string;
  playlistTotalSongs: number;
}

export default function HeaderPlaylist({
  playlistTitle,
  playlistTotalSongs,
}: HeaderPlaylistProps) {
  return (
    <div className="flex items-center w-full border shadow-lg bg-primary-100 rounded-2xl border-primary-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-center w-24 h-24 m-6 transition-all border shadow-md sm:w-36 sm:h-36 rounded-3xl bg-primary-300/70 border-primary-200/50 backdrop-blur-sm">
        <Library className="w-16 h-16 transition-all text-primary-600 sm:w-24 sm:h-24 drop-shadow-sm" />
      </div>
      <div className="pr-6">
        <h1 className="mx-4 text-4xl font-bold transition-all text-primary-800 sm:text-6xl drop-shadow-md">
          {playlistTitle}
        </h1>
        <p className="mx-4 text-lg font-semibold transition-all text-primary-600 sm:text-2xl drop-shadow-sm">
          {playlistTotalSongs} songs
        </p>
      </div>
    </div>
  );
}
