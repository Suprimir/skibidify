import type { Song, SongCardContext } from "@/types/Song";
import { useState } from "react";
import { Play } from "lucide-react";
import { usePlayer } from "@/contexts/player";
import CustomContextMenu from "./ContextMenuSong";

interface SongCardProps {
  song: Song;
  context?: SongCardContext;
  playlistId?: string;
}

export default function SongCard({
  song,
  context = "library",
  playlistId,
}: SongCardProps) {
  const { handlePlay } = usePlayer();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="flex w-full p-3 sm:p-4 space-x-3 sm:space-x-5 transition-all border shadow-md rounded-xl bg-primary-50 backdrop-blur-sm border-primary-200/50 hover:shadow-lg hover:bg-primary-200/90 group cursor-pointer"
      >
        <div className="flex items-center justify-center flex-shrink-0 overflow-hidden transition-all border shadow-md rounded-xl w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 border-primary-200/30">
          <img
            src={song.thumbnailUrl}
            alt={`${song.title} thumbnail`}
            className="object-cover object-center w-16 h-16 sm:w-32 sm:h-32  transition-transform rounded-xl group-hover:scale-105"
          />
        </div>

        <div className="flex justify-between w-full min-w-0">
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 sm:pr-4">
            <h2 className="font-bold truncate transition-colors text-primary-800 text-sm sm:text-base lg:text-lg drop-shadow-sm group-hover:text-primary-900 leading-tight">
              {song.title}
            </h2>
            <p className="font-medium truncate transition-colors text-primary-600 group-hover:text-primary-700 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
              {song.channelTitle}
            </p>
          </div>

          <div className="flex items-center justify-center flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(song);
              }}
              className="flex items-center justify-center transition-all border rounded-full shadow-md cursor-pointer bg-primary-500 hover:bg-primary-600 hover:shadow-lg hover:scale-110 active:scale-95 border-primary-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 w-10 h-10 sm:w-12 sm:h-12"
              aria-label={`Play ${song.title} by ${song.channelTitle}`}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary-50 drop-shadow-sm ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      <CustomContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        song={song}
        context={context}
        playlistId={playlistId}
      />
    </>
  );
}
