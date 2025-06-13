import { useRef } from "react";
import type { Song } from "@Types/Song";
import { Play } from "lucide-react";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!audioRef.current) {
      console.log(song.filePath);
      audioRef.current = new Audio(song.filePath);
    }
    audioRef.current.play();
  };

  return (
    <div className="flex max-w-4xl p-3 space-x-4 rounded-lg bg-rose-100">
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
