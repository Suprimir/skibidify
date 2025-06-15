import { useSongs } from "@Contexts/SongContext";
import type { Song } from "@Types/Song";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const { deleteSong } = useSongs();

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

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed z-50 p-2 border rounded-md shadow-lg bg-primary-200 border-primary-300 w-52"
    >
      <p className="px-2 py-1 text-xs font-medium text-primary-700">
        {song.title || "Sin título"}
      </p>
      <ul className="mt-1 text-sm text-primary-700">
        <li className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50">
          <Heart className="w-4 h-4" />
          Agregar a favoritos
        </li>
        <li
          onClick={handleDelete}
          className="flex items-center gap-2 p-2 rounded cursor-pointer text-primary-700 hover:bg-primary-300/50"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </li>
      </ul>
    </div>
  );
}
