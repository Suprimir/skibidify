import type { Playlist, Song } from "src/types/Song";
import { useEffect, useState } from "react";
import { SongContext } from "./songContext";

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  /*
        States
  */
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  /*
        Funciones
  */
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
      refreshSongs();
      refreshPlaylists();
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

  const updatePlaylist = async (
    playlistId: string,
    name?: string,
    imageFile?: File
  ) => {
    const formData = new FormData();

    if (name) {
      formData.append("name", name);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/playlists/" + playlistId, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      refreshPlaylists();
    } else {
      console.error("Error al actualizar la playlist");
    }
  };

  const markAsFavorite = async (songId: string) => {
    const res = await fetch(`/api/songs/favorite/${songId}`, {
      method: "POST",
    });

    if (res.ok) {
      await refreshSongs();
    } else {
      console.error("Error al obtener las canciones");
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    const res = await fetch(`/api/playlists/song/${playlistId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    });

    if (res.ok) {
      await refreshPlaylists();
    } else {
      console.error("Error al obtener las canciones");
    }
  };

  /*
        Effect para inicializar las canciones y playlists
  */
  useEffect(() => {
    refreshSongs();
    refreshPlaylists();
  }, []);

  const value = {
    songs,
    playlists,
    refreshSongs,
    deleteSong,
    addPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    updatePlaylist,
    markAsFavorite,
    removeSongFromPlaylist,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};
