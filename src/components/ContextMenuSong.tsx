// ContextMenuSong.tsx
import { useSongs } from "@/contexts/song";
import type { Song, SongCardContext } from "@/types/Song";
import { ChevronRight, Heart, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  song: Song;
  context: SongCardContext;
  playlistId?: string;
}

export default function CustomContextMenu({
  x,
  y,
  visible,
  onClose,
  song,
  context,
  playlistId,
}: CustomContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    deleteSong,
    playlists,
    addSongToPlaylist,
    markAsFavorite,
    removeSongFromPlaylist,
  } = useSongs();
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
    if (context === "playlist" && playlistId) {
      removeSongFromPlaylist(playlistId, song.id);
    } else if (context === "favorites") {
      markAsFavorite(song.id);
    } else {
      deleteSong(song.id);
    }

    onClose();
  };

  const handleAddToPlaylist = (targetPlaylistId: string) => {
    addSongToPlaylist(song.id, targetPlaylistId);
    onClose();
  };

  const getDeleteText = () => {
    switch (context) {
      case "playlist":
        return "Eliminar de playlist";
      case "favorites":
        return "Eliminar de favoritos";
      default:
        return "Eliminar";
    }
  };

  const getDeleteIcon = () => {
    return context === "playlist" ? X : Trash2;
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
        {/* Favoritos - Solo mostrar si no estamos en el contexto de favoritos */}
        {context !== "favorites" && (
          <li
            onClick={() => {
              markAsFavorite(song.id);
              onClose();
            }}
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50"
          >
            <Heart
              className={`w-4 h-4 ${song.favorite ? "fill-primary-700" : ""}`}
            />
            {song.favorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
          </li>
        )}

        {/* Agregar a playlist - Solo mostrar si no estamos ya en una playlist o si estamos en library */}
        {(context === "library" || context === "favorites") && (
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
        )}
        {context === "playlist" && (
          <li
            className="relative group"
            onMouseEnter={() => setHoveringPlaylist(true)}
            onMouseLeave={() => setHoveringPlaylist(false)}
          >
            <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50">
              <ChevronRight className="w-4 h-4" />
              Agregar a otra playlist
            </div>

            <ul
              className={`absolute top-0 left-full min-w-[160px] bg-primary-100 border border-primary-300 rounded-md shadow-md transition-opacity duration-150 ${
                hoveringPlaylist
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {playlists.filter((p) => p.id !== playlistId).length === 0 ? (
                <li className="px-4 py-2 text-sm text-primary-600">
                  No hay otras playlists
                </li>
              ) : (
                playlists
                  .filter((p) => p.id !== playlistId)
                  .map((playlist) => (
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
        )}

        {/* Eliminar */}
        <li
          onClick={handleDelete}
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary-300/50"
        >
          {(() => {
            const Icon = getDeleteIcon();
            return <Icon className="w-4 h-4" />;
          })()}
          {getDeleteText()}
        </li>
      </ul>
    </div>
  );
}
