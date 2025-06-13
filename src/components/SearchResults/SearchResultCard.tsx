import { Download, LoaderCircle } from "lucide-react";
import type { YouTubeSearchItem } from "@Types/YoutubeSearch";
import { useState } from "react";

interface SearchResultCardProps {
  youtubeItem: YouTubeSearchItem;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export default function SearchResultCard({
  youtubeItem,
}: SearchResultCardProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch("/api/songs/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeItem,
        }),
      });

      if (!response.ok) {
        throw new Error(`ERROR! Estado: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message || data);
    } catch (error) {
      console.error("Error en la descarga:", error);
      alert("Error al descargar la canción");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="flex max-w-4xl p-3 space-x-4 rounded-lg bg-rose-100">
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
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 px-4 py-2 my-auto font-bold text-white rounded-md cursor-pointer bg-rose-400 disabled:bg-rose-300 disabled:cursor-default me-4"
        >
          {isDownloading ? (
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
