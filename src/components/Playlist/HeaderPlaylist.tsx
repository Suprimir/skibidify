import { useSongs } from "@/contexts/song";
import type { Playlist } from "@/types/Song";
import { Library, PencilLine } from "lucide-react";
import { useRef, useState } from "react";

interface HeaderPlaylistProps {
  playlist?: Playlist;
}

export default function HeaderPlaylist({ playlist }: HeaderPlaylistProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updatePlaylist } = useSongs();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editableRef.current?.blur();
      setIsEditing(false);
    }
  };

  function handleImageChange(imageFile: File) {
    if (!playlist) return;

    updatePlaylist(playlist.id, undefined, imageFile);
  }

  function handleNameChange(newName: string) {
    if (!playlist) return;

    updatePlaylist(playlist.id, newName, undefined);
  }

  return (
    <div className="flex items-center w-full border shadow-lg bg-primary-100 rounded-2xl border-primary-200/50 backdrop-blur-sm">
      <label htmlFor="fileInput">
        {!playlist?.image ? (
          <div className="flex items-center justify-center w-24 h-24 m-6 transition-all border shadow-md sm:w-36 sm:h-36 rounded-3xl bg-primary-300/70 hover:bg-primary-300/50 border-primary-200/50 backdrop-blur-sm">
            <Library className="w-16 h-16 transition-all text-primary-600 sm:w-24 sm:h-24 drop-shadow-sm" />
          </div>
        ) : (
          <div className="flex relative items-center justify-center w-24 h-24 m-6 transition-all border shadow-md sm:w-36 sm:h-36 rounded-3xl bg-primary-300/70 hover:bg-primary-300/50 border-primary-200/50 backdrop-blur-sm">
            <div className="absolute inset-0 z-10 hover:bg-primary-300/20 rounded-3xl"></div>
            <img
              src={playlist.image}
              className="w-24 h-24 object-cover transition-all sm:w-32 sm:h-32 rounded-2xl drop-shadow-sm"
            ></img>
          </div>
        )}
      </label>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageChange(file);
          }
        }}
      />
      <div>
        <div
          id="editableTitle"
          ref={editableRef}
          contentEditable
          spellCheck="false"
          suppressContentEditableWarning
          onFocus={() => setIsEditing(true)}
          onKeyDown={handleKeyDown}
          onBlur={() =>
            handleNameChange(
              editableRef.current ? editableRef.current.innerText : ""
            )
          }
          className={`flex items-end gap-4 cursor-pointer border-b group mx-4 text-4xl sm:text-6xl font-bold transition-all text-primary-800 drop-shadow-md outline-none min-w-[60px] ${
            isEditing
              ? " border-primary-500 animate-pulse"
              : "border-transparent"
          }`}
        >
          {playlist?.name}
          <PencilLine className="w-12 h-12 text-primary-800 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200" />
        </div>
        <p className="mx-4 text-lg font-semibold transition text-primary-600 sm:text-2xl drop-shadow-sm">
          {playlist ? playlist.songs.length : ""} songs
        </p>
      </div>
    </div>
  );
}
