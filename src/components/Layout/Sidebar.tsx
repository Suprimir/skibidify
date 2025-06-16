import { useSongs } from "@Contexts/SongContext";
import { FoldHorizontal, Library, Music } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownSidebar from "./Sidebar/DropdownSidebar";
import ContextMenuPlaylist from "../ContextMenuPlaylist";
import { type Playlist } from "@Types/Song";

const defaultPlaylist: Playlist = {
  id: "",
  name: "",
  songs: [""],
};

export default function Sidebar() {
  const [isManuallyCollapsed, setIsManuallyCollapsed] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<Playlist>(defaultPlaylist);

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

  const { playlists } = useSongs();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isCollapsed = isMobile || isManuallyCollapsed;

  function handleCollapse() {
    if (!isMobile) {
      setIsManuallyCollapsed(!isManuallyCollapsed);
    }
  }

  return (
    <div
      className={`h-full ${
        isCollapsed ? "w-22" : "w-72"
      } bg-gradient-to-b from-primary-50 to-primary-100 transition-all duration-300 flex flex-col border-r border-primary-200 shadow-lg`}
    >
      {/* Header con acciones como colapsar sidebar y crear playlists */}
      <div className="flex items-center justify-between p-6 border-b text-primary-800 border-primary-200 bg-primary-200/50 backdrop-blur-sm">
        <button
          onClick={handleCollapse}
          className="p-2 transition-all duration-200 rounded-lg cursor-pointer hover:bg-primary-100 hover:scale-105 active:scale-95"
        >
          <FoldHorizontal className="w-6 h-6 text-primary-600" />
        </button>
        {!isCollapsed && (
          <h1 className="mx-4 text-lg font-bold truncate text-primary-700 drop-shadow-sm">
            Your Library
          </h1>
        )}
        {!isCollapsed && <DropdownSidebar />}
      </div>

      {/* Contenido (Liked Songs, Playlists, Artistas) */}
      <div className="flex-1 p-3.5 overflow-y-auto">
        <div onContextMenu={(e) => e.preventDefault()} className="mb-4">
          <button
            onClick={() => navigate("/library")}
            className="flex items-center w-full gap-4 p-4 transition-all duration-200 border shadow-sm rounded-xl bg-gradient-to-r from-primary-100 to-primary-100 hover:from-primary-200 hover:to-primary-200 group hover:shadow-md border-primary-200/50 hover:border-primary-300"
          >
            <div className="flex-shrink-0 transition-colors duration-200 rounded-lg">
              <Library className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
            </div>
            {!isCollapsed && (
              <p className="font-semibold truncate text-primary-700 group-hover:text-primary-800 drop-shadow-sm">
                Library
              </p>
            )}
          </button>
        </div>
        {playlists.map((playlist) => (
          <div
            onContextMenu={(e) => {
              setSelectedPlaylist(playlist);
              handleContextMenu(e);
            }}
            className="mb-4"
          >
            <button
              onClick={() => navigate(`/playlist?id=${playlist.id}`)}
              className="flex items-center w-full gap-4 p-4 transition-all duration-200 border shadow-sm rounded-xl bg-gradient-to-r from-primary-100 to-primary-100 hover:from-primary-200 hover:to-primary-200 group hover:shadow-md border-primary-200/50 hover:border-primary-300"
            >
              <div className="flex-shrink-0 transition-colors duration-200 rounded-lg">
                <Music className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
              </div>
              {!isCollapsed && (
                <p className="font-semibold truncate text-primary-700 group-hover:text-primary-800 drop-shadow-sm">
                  {playlist.name}
                </p>
              )}
            </button>
          </div>
        ))}
      </div>

      <ContextMenuPlaylist
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        playlist={selectedPlaylist}
      />
    </div>
  );
}
