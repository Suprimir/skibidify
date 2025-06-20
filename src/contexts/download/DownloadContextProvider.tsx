import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useAlert } from "@/contexts/alert";
import { useSongs } from "@/contexts/song";
import { Clock, Download, LoaderCircle, Music, X } from "lucide-react";
import { DownloadContext } from "./downloadContext";
import type { YouTubeSearchItem } from "@/types/YoutubeSearch";

export const DownloadProvider = ({ children }: { children: ReactNode }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingQueue, setDownloadingQueue] = useState<YouTubeSearchItem[]>(
    () => {
      const storedDownloadQueue = localStorage.getItem("downloadQueue");
      return storedDownloadQueue
        ? (JSON.parse(storedDownloadQueue) as YouTubeSearchItem[])
        : [];
    }
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { showAlert } = useAlert();
  const { songs, refreshSongs } = useSongs();

  useEffect(() => {
    if (downloadingQueue && downloadingQueue.length > 0) {
      localStorage.setItem("downloadQueue", JSON.stringify(downloadingQueue));
    } else if (downloadingQueue === null || downloadingQueue.length === 0) {
      localStorage.removeItem("downloadQueue");
    }
  }, [downloadingQueue]);

  const isDownloading = downloadingId !== null || downloadingQueue.length > 0;

  const downloadSong = useCallback(
    async (youtubeItem: YouTubeSearchItem) => {
      const id = youtubeItem.id.videoId;
      if (!id) return;

      setDownloadingId(id);

      try {
        const res = await fetch("/api/songs/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ youtubeItem }),
        });
        const data = await res.json();

        if (res.ok) {
          await refreshSongs();
          showAlert("success", "Download finished", data.message);
        } else {
          showAlert(
            "error",
            "Download failed",
            data.message || "Error downloading song"
          );
          console.error("Error al descargar la canción:", data);
        }
      } catch (error) {
        showAlert("error", "Download failed", "Network error occurred");
        console.error("Error al descargar la canción:", error);
      } finally {
        setDownloadingId(null);
      }
    },
    [refreshSongs, showAlert]
  );

  useEffect(() => {
    if (downloadingQueue.length === 0 || isProcessing) return;

    const processQueue = async () => {
      setIsProcessing(true);

      const currentSong = downloadingQueue[0];
      await downloadSong(currentSong);
      setDownloadingQueue((prev) =>
        prev.filter((song) => song.id !== currentSong.id)
      );

      setIsProcessing(false);
    };

    processQueue();
  }, [downloadingQueue, isProcessing, downloadSong]);

  const addToDownloadQueue = (youtubeItem: YouTubeSearchItem) => {
    const videoId = youtubeItem.id.videoId;

    if (!videoId) {
      showAlert("error", "Invalid video", "This video doesn't have a valid ID");
      return;
    }

    if (songs.find((song) => song.id === videoId)) {
      showAlert(
        "error",
        "Already downloaded",
        "This song has already been downloaded"
      );
      return;
    }

    setDownloadingQueue((prev) => {
      const exists = prev.some(
        (item) => item.id.videoId === youtubeItem.id.videoId
      );
      if (exists) {
        showAlert(
          "error",
          "Already in queue",
          "This song is already in the download queue"
        );
        return prev;
      }
      return [...prev, youtubeItem];
    });
  };

  const removeFromQueue = (videoId?: string) => {
    if (!videoId) return;

    setDownloadingQueue((prev) =>
      prev.filter((item) => item.id.videoId !== videoId)
    );
  };

  const value = {
    downloadingId,
    downloadSong,
    addToDownloadQueue,
    downloadingQueue,
    isDownloading,
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}

      {downloadingQueue.length > 0 && (
        <div
          className="fixed bottom-4 right-4 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute bottom-20 right-0 transition-all duration-300 ease-in-out ${
              isHovered
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="bg-primary-50 border border-primary-200 rounded-xl shadow-xl min-w-[320px] max-w-[400px] max-h-[400px] overflow-hidden">
              <div className="text-primary-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  <span className="font-semibold">Download Queue</span>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {downloadingId && (
                  <div className="border-primary-100">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <LoaderCircle className="w-4 h-4 text-primary-500 animate-spin" />
                        <span className="text-sm font-medium text-primary-700">
                          Currently downloading
                        </span>
                      </div>
                      {downloadingQueue
                        .filter((item) => item.id.videoId === downloadingId)
                        .map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.snippet.thumbnails.default.url}
                                alt={item.snippet.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary-900 truncate">
                                {item.snippet.title}
                              </p>
                              <p className="text-xs text-primary-500 truncate">
                                {item.snippet.channelTitle}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {downloadingQueue
                  .filter((item) => item.id.videoId !== downloadingId)
                  .map((item, index) => (
                    <div key={item.id.videoId} className="border-primary-100">
                      <div className="p-3 hover:bg-primary-50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary-400" />
                          <span className="text-sm font-medium text-primary-600">
                            Position #{index + 1} in queue
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.snippet.thumbnails.default.url}
                              alt={item.snippet.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-900 truncate">
                              {item.snippet.title}
                            </p>
                            <p className="text-xs text-primary-500 truncate">
                              {item.snippet.channelTitle}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromQueue(item.id.videoId)}
                            className="text-primary-400 hover:text-primary-500 p-1 rounded transition-colors"
                            title="Remove from queue"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {downloadingQueue.length > 0 && (
                <div className="bg-primary-50 px-4 py-2 border-t border-primary-100">
                  <p className="text-xs text-primary-600 text-center">
                    {downloadingQueue.length} song
                    {downloadingQueue.length !== 1 ? "s" : ""} remaining
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-500 text-white p-4 rounded-full shadow-lg flex items-center gap-3 cursor-pointer hover:bg-primary-600 transition-all hover:scale-105">
            <div className="relative">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}
    </DownloadContext.Provider>
  );
};
