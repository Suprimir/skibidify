import { createContext, useContext, useState, useEffect } from "react";
import type { Playlist, Song } from "@Types/Song";
import type { YouTubeSearchItem } from "@Types/YoutubeSearch";

interface SongContextType {
  songs: Song[];
  playlists: Playlist[];
  downloadingId: string | null;
  refreshSongs: () => void;
  deleteSong: (id: string) => Promise<void>;
  addPlaylist: () => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (songId: string, playlistId: string) => Promise<void>;
  downloadSong: (youtubeItem: YouTubeSearchItem) => Promise<void>;
}

const SongContext = createContext<SongContextType | null>(null);

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const refreshSongs = async () => {
    const res = await fetch("/api/songs");
    const data = await res.json();
    setSongs(data);
  };

  const refreshPlaylists = async () => {
    const res = await fetch("/api/playlists");
    const data = await res.json();
    setPlaylists(data);
  };

  const deleteSong = async (id: string) => {
    const res = await fetch("/api/songs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: id }),
    });

    if (res.ok) {
      setSongs((prev) => prev.filter((s) => s.id !== id)); // actualiza localmente
    } else {
      console.error("Error al eliminar la canción");
    }
  };

  const addPlaylist = async () => {
    const res = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      refreshPlaylists();
    } else {
      console.error("Error al agregar playlist");
    }
  };

  const deletePlaylist = async (id: string) => {
    const res = await fetch("/api/playlists/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: id,
      }),
    });

    if (res.ok) {
      refreshPlaylists();
    } else {
      console.error("Error al eliminar la playlist");
    }
  };

  const addSongToPlaylist = async (songId: string, playlistId: string) => {
    const res = await fetch("/api/playlists/song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId,
        playlistId,
      }),
    });

    if (res.ok) {
      refreshPlaylists();
    } else {
      console.error("Error al eliminar la playlist");
    }
  };

  const downloadSong = async (youtubeItem: YouTubeSearchItem) => {
    const id = youtubeItem.id.videoId;
    if (!id) return;

    setDownloadingId(id);

    const res = await fetch("/api/songs/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeItem }),
    });

    if (res.ok) {
      await refreshSongs();
    } else {
      console.error("Error al obtener las canciones");
    }

    setDownloadingId(null);
  };

  useEffect(() => {
    refreshSongs();
    refreshPlaylists();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        playlists,
        downloadingId,
        refreshSongs,
        deleteSong,
        downloadSong,
        addPlaylist,
        deletePlaylist,
        addSongToPlaylist,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSongs must be used within SongProvider");
  return context;
};
