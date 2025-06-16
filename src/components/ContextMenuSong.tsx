import { useSongs } from "@Contexts/SongContext";
import type { Song } from "@Types/Song";
import { ChevronRight, Heart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  song: Song;
}

export default function CustomContextMenu({
  x,
  y,
  visible,
  onClose,
  song,
}: CustomContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteSong, playlists, addSongToPlaylist } = useSongs();
  const [hoveringPlaylist, setHoveringPlaylist] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!visible) return null;

  const handleDelete = () => {
    deleteSong(song.id);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(song.id, playlistId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed z-50 p-2 border rounded-md shadow-lg bg-primary-200 border-primary-300 w-52 text-sm text-primary-700"
    >
      <p className="px-2 py-1 text-xs font-medium text-primary-700">
        {song.title || "Sin título"}
      </p>
      <ul className="mt-1">
        <li className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50">
          <Heart className="w-4 h-4" />
          Agregar a favoritos
        </li>

        <li
          className="relative group"
          onMouseEnter={() => setHoveringPlaylist(true)}
          onMouseLeave={() => setHoveringPlaylist(false)}
        >
          <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50">
            <ChevronRight className="w-4 h-4" />
            Agregar a playlist
          </div>

          {/* Submenu */}
          <ul
            className={`absolute top-0 left-full min-w-[160px] bg-primary-100 border border-primary-300 rounded-md shadow-md transition-opacity duration-150 ${
              hoveringPlaylist
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {playlists.length === 0 ? (
              <li className="px-4 py-2 text-sm text-primary-600">
                No hay playlists
              </li>
            ) : (
              playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-primary-300/50"
                >
                  {playlist.name}
                </li>
              ))
            )}
          </ul>
        </li>

        <li
          onClick={handleDelete}
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </li>
      </ul>
    </div>
  );
}
