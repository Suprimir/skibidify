import type { Song } from "@Types/Song";
import { Play } from "lucide-react";

interface SongCardProps {
  setSongPlaying: (song: string) => void;
  song: Song;
}

export default function SongCard({ song, setSongPlaying }: SongCardProps) {
  const handlePlay = () => {
    setSongPlaying(song.filePath);
  };

  return (
    <div className="flex max-w-screen p-3 space-x-4 rounded-lg bg-rose-100">
      <div className="flex items-center justify-center flex-shrink-0 overflow-hidden rounded-md size-24">
        <img
          src={song.thumbnailUrl}
          className="object-cover object-center w-36 h-36"
        />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-center">
          <h1 className="font-bold">{song.title}</h1>
          <p>{song.channelTitle}</p>
        </div>
        <button
          onClick={handlePlay}
          className="flex items-center justify-center gap-2 px-4 py-2 my-auto font-bold text-white rounded-md cursor-pointer bg-rose-400 hover:bg-rose-500 me-4"
        >
          <Play size={20} />
          Play
        </button>
      </div>
    </div>
  );
}
