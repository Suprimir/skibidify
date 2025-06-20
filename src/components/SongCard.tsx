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
        className="flex w-full p-4 space-x-5 transition-all border shadow-md rounded-xl bg-primary-50 backdrop-blur-sm border-primary-200/50 hover:shadow-lg hover:bg-primary-200/90 group"
      >
        <div className="flex items-center justify-center flex-shrink-0 overflow-hidden transition-all border shadow-md rounded-xl size-16 sm:size-24 border-primary-200/30">
          <img
            src={song.thumbnailUrl}
            className="object-cover object-center w-32 h-32 transition-transform rounded-xl group-hover:scale-105"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h1 className="font-bold truncate transition-colors text-primary-800 text-md sm:text-lg drop-shadow-sm group-hover:text-primary-900">
              {song.title}
            </h1>
            <p className="font-medium truncate transition-colors text-primary-600 group-hover:text-primary-700">
              {song.channelTitle}
            </p>
          </div>
          <button
            onClick={() => handlePlay(song)}
            className="flex items-center justify-center gap-2 my-auto font-bold transition-all border rounded-full shadow-md cursor-pointer bg-primary-500 hover:bg-primary-600 me-4 hover:shadow-lg hover:scale-110 active:scale-95 border-primary-300/50"
          >
            <Play className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />
          </button>
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
