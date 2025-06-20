export interface Song {
  id: string;
  title: string;
  channelTitle?: string;
  description?: string;
  thumbnailUrl?: string;
  filePath: string;
  addedAt: string;
  favorite: boolean;
}

export interface Playlist {
  id: string;
  image: string;
  name: string;
  songs: string[];
}

export type SongCardContext = "library" | "playlist" | "favorites";
