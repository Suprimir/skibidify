import { Download, LoaderCircle, Clock, CheckCircle, X } from "lucide-react";
import type { YouTubeSearchItem } from "@/types/YoutubeSearch";
import { useDownload } from "@/contexts/download";
import { useMemo } from "react";
import { useSongs } from "@/contexts/song";

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
  const { addToDownloadQueue, downloadingId, downloadingQueue } = useDownload();
  const { songs } = useSongs();

  const videoId = youtubeItem.id.videoId;

  const downloadState = useMemo(() => {
    if (!videoId) {
      return "error";
    }

    if (songs.find((song) => song.id === videoId)) {
      return "downloaded";
    }

    if (downloadingId === videoId) {
      return "downloading";
    }

    const isInQueue = downloadingQueue.some(
      (item) => item.id.videoId === videoId
    );
    if (isInQueue) {
      return "queued";
    }

    return "idle";
  }, [downloadingId, downloadingQueue, videoId, songs]);

  const handleDownload = async () => {
    if (downloadState !== "idle" || !videoId) return;

    try {
      addToDownloadQueue(youtubeItem);
    } catch (error) {
      console.error("Error adding to download queue:", error);
    }
  };

  const getButtonConfig = () => {
    switch (downloadState) {
      case "error":
        return {
          icon: <X className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />,
          text: "Error",
          disabled: true,
          className: "bg-red-500 cursor-not-allowed",
        };
      case "downloaded":
        return {
          icon: (
            <CheckCircle className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />
          ),
          text: "Downloaded",
          disabled: true,
          className: "bg-green-500 cursor-not-allowed",
        };
      case "downloading":
        return {
          icon: (
            <LoaderCircle className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm animate-spin" />
          ),
          text: "Downloading...",
          disabled: true,
          className: "bg-blue-500 cursor-not-allowed",
        };
      case "queued":
        return {
          icon: (
            <Clock className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />
          ),
          text: "In Queue",
          disabled: true,
          className: "bg-yellow-500 cursor-not-allowed",
        };
      default:
        return {
          icon: (
            <Download className="w-12 h-12 p-3 text-primary-50 drop-shadow-sm" />
          ),
          text: "Download",
          disabled: false,
          className:
            "bg-primary-500 hover:bg-primary-600 hover:shadow-lg hover:scale-110 active:scale-95",
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="flex w-full p-4 space-x-5 transition-all border shadow-md rounded-xl backdrop-blur-sm bg-primary-50 border-primary-200/50 hover:shadow-lg hover:bg-primary-200/90 group">
      <div className="flex items-center justify-center flex-shrink-0 overflow-hidden transition-all border shadow-md rounded-xl size-16 sm:size-24 border-primary-200/30">
        <img
          src={youtubeItem.snippet.thumbnails.high.url}
          alt={decodeHtmlEntities(youtubeItem.snippet.title)}
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

          {downloadState !== "idle" && (
            <div className="flex items-center gap-1 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  downloadState === "downloading"
                    ? "bg-blue-500 animate-pulse"
                    : downloadState === "queued"
                    ? "bg-yellow-500"
                    : downloadState === "downloaded"
                    ? "bg-green-500"
                    : downloadState === "error"
                    ? "bg-red-500"
                    : ""
                }`}
              ></div>
              <span
                className={`text-xs font-medium ${
                  downloadState === "downloading"
                    ? "text-blue-600"
                    : downloadState === "queued"
                    ? "text-yellow-600"
                    : downloadState === "downloaded"
                    ? "text-green-600"
                    : downloadState === "error"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {downloadState === "downloading"
                  ? "Downloading..."
                  : downloadState === "queued"
                  ? "In queue"
                  : downloadState === "downloaded"
                  ? "Downloaded"
                  : downloadState === "error"
                  ? "Invalid video"
                  : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 me-4">
          <button
            onClick={handleDownload}
            disabled={buttonConfig.disabled}
            title={buttonConfig.text}
            className={`flex items-center justify-center gap-2 font-bold border rounded-full shadow-md cursor-pointer
              transition-all border-primary-300/50 ${buttonConfig.className}
              disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {buttonConfig.icon}
          </button>
        </div>
      </div>
    </div>
  );
}
