import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface PlayerBarProps {
  changeVolume: (volume: number) => void;
  handlePause: () => void;
  paused: boolean;
  duration: number;
}

export default function PlayerBar({
  changeVolume,
  handlePause,
  paused,
  duration,
}: PlayerBarProps) {
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    changeVolume(volume);
  }, [volume]);

  return (
    <div className="fixed bottom-0 bg-rose-300 w-full p-4 flex justify-between items-center mt-auto">
      <img src="/vite.svg" alt="Logo" className="w-8 h-8" />

      <div className="flex flex-col space-y-2 items-center">
        <div className="flex gap-4 items-center">
          <button className="px-2 py-1 bg-rose-100 rounded-full">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handlePause}
            className="px-2 py-1 bg-rose-100 rounded-full"
          >
            {paused ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>
          <button className="px-2 py-1 bg-rose-100 rounded-full">
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p>00:00</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            className="min-w-xl"
          />
          <p>{duration}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
