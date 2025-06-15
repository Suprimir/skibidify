import { useSongs } from "@Contexts/SongContext";
import HeaderPlaylist from "src/components/HeaderPlaylist";
import SongCard from "src/components/SongCard";

export default function LibraryPage() {
  const { songs } = useSongs();

  return (
    <div>
      <HeaderPlaylist
        playlistTitle="Library"
        playlistTotalSongs={songs ? songs.length : 0}
      />
      <div className="pb-8">
        {songs?.map((song) => (
          <div key={song.id} className="py-2">
            <SongCard song={song} />
          </div>
        ))}{" "}
      </div>
    </div>
  );
}
