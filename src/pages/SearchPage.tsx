import { useSongs } from "@/contexts/song";
import { Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SongCard from "src/components/SongCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const { songs } = useSongs();
  const navigate = useNavigate();

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSongs.length === 0) {
    return <p>No se encontraron canciones para "{searchTerm}"</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-semibold text-primary-600">
          {filteredSongs.length}{" "}
          {filteredSongs.length === 1 ? "resultado" : "resultados"}
        </h1>
        <div className="flex-1 border-b-2 border-primary-500 mx-8"></div>
        <button
          onClick={() => navigate(`/download?q=${searchTerm}`)}
          className="flex items-center gap-2 text-primary-600"
        >
          <Download className="w-6 h-6" />
          Ir a descargar
        </button>
      </div>
      {filteredSongs.map((song, index) => (
        <SongCard key={song.id || index} song={song} context="library" />
      ))}
    </div>
  );
}
