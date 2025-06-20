import { createContext } from "react";
import type { Playlist, Song } from "@/types/Song";

export interface SongContextType {
  songs: Song[];
  playlists: Playlist[];
  refreshSongs: () => void;
  deleteSong: (id: string) => Promise<void>;
  addPlaylist: () => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (songId: string, playlistId: string) => Promise<void>;
  updatePlaylist: (
    playlistId: string,
    name?: string,
    imageFile?: File
  ) => Promise<void>;
  markAsFavorite: (songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const SongContext = createContext<SongContextType | null>(null);
