import { useSongs } from "@/contexts/song";
import type { Playlist } from "@/types/Song";
import { Library } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenuPlaylist from "src/components/ContextMenuPlaylist";
import SongCard from "src/components/SongCard";

const defaultPlaylist: Playlist = {
  id: "",
  image: "",
  name: "",
  songs: [""],
};

export default function HomePage() {
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

  const { playlists, songs } = useSongs();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary-600 font-bold border-b-2 border-primary-300 mb-4 sm:mb-6">
        Playlists
      </h1>

      {/* Responsive Grid for Playlists */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {playlists.slice(0, 5).map((playlist) => (
          <div
            key={playlist.id}
            onContextMenu={(e) => {
              setSelectedPlaylist(playlist);
              handleContextMenu(e);
            }}
            onClick={() => navigate(`/playlist?id=${playlist.id}`)}
            className="cursor-pointer group w-full"
          >
            {/* Playlist Image Container */}
            <div className="bg-primary-100 border-primary-200 w-full aspect-square overflow-hidden shadow-md p-4 sm:p-6 rounded-t-2xl group-hover:bg-primary-200 transition-colors duration-200">
              {playlist.image ? (
                <div className="w-full h-full rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-110">
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-xl">
                  <Library className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-primary-600 transition-transform duration-200 group-hover:scale-110" />
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="bg-primary-200/60 rounded-b-xl shadow-md p-3 sm:p-4 group-hover:bg-primary-300/80 transition-colors duration-200">
              <h2 className="text-primary-600 text-sm sm:text-base lg:text-lg xl:text-xl font-bold truncate">
                {playlist.name}
              </h2>
              <p className="text-primary-500 text-xs sm:text-sm lg:text-base font-semibold">
                {playlist.songs.length}
                {playlist.songs.length === 1 ? " song" : " songs"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary-600 font-bold border-b-2 border-primary-300 mb-4 sm:mb-6">
        Recently Added
      </h1>

      {/* Songs List */}
      <div className="pb-8 space-y-2 sm:space-y-4">
        {songs
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          )
          .slice(0, 5)
          .map((song) => (
            <SongCard key={song.id} song={song} />
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
