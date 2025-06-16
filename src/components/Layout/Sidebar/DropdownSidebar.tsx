import { useSongs } from "@Contexts/SongContext";
import { Music, PlusCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DropdownSidebar() {
  const [open, setOpen] = useState(false);
  const { addPlaylist } = useSongs();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 transition-all duration-200 rounded-lg hover:bg-primary-100 hover:scale-105 active:scale-95"
      >
        <PlusCircle className="w-6 h-6 text-primary-600" />
      </button>

      <div
        className={`absolute left-0 top-12 w-64 bg-primary-100 p-2 rounded-xl shadow-lg border border-primary-300 transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <button
          onClick={addPlaylist}
          className="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-primary-500 text-lg hover:bg-primary-300 transition"
        >
          <Music className="w-6 h-6" />
          Crear Playlist
        </button>
      </div>
    </div>
  );
}
