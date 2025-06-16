import { Download, LoaderCircle } from "lucide-react";
import type { YouTubeSearchItem } from "@Types/YoutubeSearch";
import { useSongs } from "@Contexts/SongContext";

interface SearchResultCardProps {
  downloadingId: string | null;
  youtubeItem: YouTubeSearchItem;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export default function SearchResultCard({
  downloadingId,
  youtubeItem,
}: SearchResultCardProps) {
  const { downloadSong } = useSongs();

  const handleDownload = async () => {
    try {
      await downloadSong(youtubeItem);
      alert("Descarga finalizada");
    } catch {
      alert("Error al descargar la canción");
    }
  };

  return (
    <div className="flex w-full p-4 space-x-5 transition-all border shadow-md rounded-xl bg-primary-50 backdrop-blur-sm border-primary-200/50 hover:shadow-lg hover:bg-primary-200/90 group">
      <div className="flex items-center justify-center flex-shrink-0 overflow-hidden transition-all border shadow-md rounded-xl size-16 sm:size-24 border-primary-200/30">
        <img
          src={youtubeItem.snippet.thumbnails.high.url}
          className="object-cover object-center w-32 h-32 transition-transform rounded-xl group-hover:scale-105"
        />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h1 className="font-bold truncate transition-colors text-primary-800 text-md sm:text-lg drop-shadow-sm group-hover:text-primary-900">
            {decodeHtmlEntities(youtubeItem.snippet.title)}
          </h1>
          <p className="font-medium truncate transition-colors text-primary-600 group-hover:text-primary-700">
            {youtubeItem.snippet.channelTitle}
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={!!downloadingId}
          className="flex items-center justify-center gap-2 my-auto font-bold border rounded-full shadow-md cursor-pointer me-4
    transition-all border-primary-300/50
     bg-primary-500
    hover:bg-primary-600 hover:shadow-lg hover:scale-110 active:scale-95
    disabled:cursor-not-allowed
    disabled:bg-primary-300
    disabled:hover:bg-primary-300
    disabled:hover:scale-100"
        >
          {downloadingId === youtubeItem.id.videoId ? (
            <LoaderCircle className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm animate-spin" />
          ) : (
            <Download className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />
          )}
        </button>
      </div>
    </div>
  );
}
