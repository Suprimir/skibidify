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
    <div className="flex p-3 space-x-4 rounded-lg max-w-screen bg-primary-100">
      <div className="flex items-center justify-center flex-shrink-0 overflow-hidden rounded-md size-24">
        <img
          src={youtubeItem.snippet.thumbnails.high.url}
          className="object-cover object-center w-36 h-36"
        />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-center">
          <h1 className="font-bold">
            {decodeHtmlEntities(youtubeItem.snippet.title)}
          </h1>
          <p>{youtubeItem.snippet.channelTitle}</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={!!downloadingId}
          className="flex items-center justify-center gap-2 px-4 py-2 my-auto font-bold text-white rounded-md cursor-pointer bg-primary-400 disabled:bg-primary-300 disabled:cursor-default me-4"
        >
          {downloadingId === youtubeItem.id.videoId ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            <Download className="size-6" />
          )}
          Download
        </button>
      </div>
    </div>
  );
}
