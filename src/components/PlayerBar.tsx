import {
  ArrowLeft,
  ArrowRight,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { usePlayer } from "@Contexts/PlayerContext";

export default function PlayerBar() {
  const {
    setVolume,
    handlePause,
    handleSeek,
    duration,
    currentTime,
    paused,
    songPlaying,
    volume,
  } = usePlayer();

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="w-full border-t shadow-2xl bg-primary-100 border-primary-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-3 sm:p-5">
        <div className="flex flex-1 max-w-xs min-w-0 space-x-3 sm:space-x-4">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 overflow-hidden border-2 shadow-md rounded-xl border-primary-200/50 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary-200/20">
            {songPlaying ? (
              <img
                src={songPlaying ? songPlaying.thumbnailUrl : "/vite.svg"}
                className="object-cover object-center rounded-lg w-28 h-28"
                alt={songPlaying?.title || "Song thumbnail"}
              />
            ) : (
              <Music className="w-8 h-8 text-primary-400" />
            )}
          </div>
          <div className="flex-col justify-center flex-1 hidden min-w-0 sm:flex">
            <span className="text-sm font-bold truncate text-primary-800 lg:text-base drop-shadow-sm">
              {songPlaying ? songPlaying.title : "No song selected"}
            </span>
            <span className="text-xs font-medium truncate lg:text-sm text-primary-600/80">
              {songPlaying ? songPlaying.channelTitle : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <button className="p-2 sm:p-2.5 bg-primary-200/70 rounded-full hover:bg-primary-200/90 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border border-primary-200/50">
              <ArrowLeft className="w-5 h-5 text-primary-600 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </button>
            <button
              onClick={handlePause}
              className="p-2.5 sm:p-3 bg-primary-200/80 rounded-full hover:bg-primary-200/95 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 border border-primary-200/50"
            >
              {paused ? (
                <Play className="w-6 h-6 text-primary-600 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              ) : (
                <Pause className="w-6 h-6 text-primary-600 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              )}
            </button>
            <button className="p-2 sm:p-2.5 bg-primary-200/70 rounded-full hover:bg-primary-200/90 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border border-primary-200/50">
              <ArrowRight className="w-5 h-5 text-primary-600 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </button>
          </div>

          <div className="flex items-center justify-center w-full max-w-2xl gap-3 sm:gap-4 lg:gap-5">
            <span className="text-xs sm:text-sm text-primary-700 font-medium min-w-[30px] sm:min-w-[40px] drop-shadow-sm flex-[1] text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="h-2 transition-all duration-200 rounded-full appearance-none cursor-pointer w-36 sm:w-full accent-primary-300 sm:h-3 bg-primary-200/40 hover:bg-primary-200/50"
              style={{
                background: `linear-gradient(to right, var(--color-primary-500) ${
                  (currentTime / duration) * 100 || 0
                }%, rgba(255,255,255,0.4) ${
                  (currentTime / duration) * 100 || 0
                }%)`,
                WebkitAppearance: "none",
              }}
            />
            <span className=" text-xs sm:text-sm text-primary-700 font-medium min-w-[35px] sm:min-w-[40px] drop-shadow-sm flex-[1] text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end flex-1 gap-3 max-w-72 sm:gap-4">
          <div className="flex-shrink-0 p-2 rounded-full bg-primary-200/70">
            <Volume2 className="w-4 h-4 text-primary-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-2 transition-all duration-200 rounded-full appearance-none cursor-pointer sm:w-full sm:h-3 max-w-20 sm:max-w-36 accent-primary-300 bg-primary-200/40 hover:bg-primary-200/50"
            style={{
              background: `linear-gradient(to right, var(--color-primary-500) ${
                volume * 100 || 0
              }%, rgba(255,255,255,0.4) ${volume * 100 || 0}%)`,
              WebkitAppearance: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
