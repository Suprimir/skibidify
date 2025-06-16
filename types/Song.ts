export interface Song {
  id: string;
  title: string;
  channelTitle?: string;
  description?: string;
  thumbnailUrl?: string;
  filePath: string;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[];
}
