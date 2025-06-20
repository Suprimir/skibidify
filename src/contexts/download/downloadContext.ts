import type { YouTubeSearchItem } from "src/types/YoutubeSearch";
import { createContext } from "react";

export interface DownloadContextType {
  downloadSong: (youtubeItem: YouTubeSearchItem) => Promise<void>;
  addToDownloadQueue: (youtubeItem: YouTubeSearchItem) => void;
  downloadingId: string | null;
  downloadingQueue: YouTubeSearchItem[];
  isDownloading: boolean;
}

export const DownloadContext = createContext<DownloadContextType | null>(null);
