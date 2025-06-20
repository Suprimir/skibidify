import path from "path";
import fs from "fs";
import { Playlist } from "../../types/Song";
import { randomUUID } from "crypto";

const documentsDir = path.join(process.cwd(), "public", "songs");
const playlistsJsonPath = path.join(documentsDir, "playlists.json");

const ensurePlaylistsDirExists = () => {
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }
};

export const savePlaylists = (playlists: Playlist[]) => {
  fs.writeFileSync(
    playlistsJsonPath,
    JSON.stringify(playlists, null, 2),
    "utf8"
  );
};

export const getAllPlaylists = (): Playlist[] => {
  ensurePlaylistsDirExists();
  if (!fs.existsSync(playlistsJsonPath)) return [];
  const jsonData = fs.readFileSync(playlistsJsonPath, "utf8");
  return JSON.parse(jsonData);
};

export const getPlaylistById = (playlistId: string): Playlist | null => {
  const playlists = getAllPlaylists();
  const playlist = playlists.find((playlist) => playlist.id === playlistId);
  if (playlist) return playlist;
  return null;
};

export const addPlaylistToJSON = () => {
  ensurePlaylistsDirExists();
  const playlists = getAllPlaylists();

  const newPlaylist: Playlist = {
    id: randomUUID(),
    image: "",
    name: `Playlist #${playlists.length + 1}`,
    songs: [],
  };

  playlists.push(newPlaylist);
  savePlaylists(playlists);

  return { success: true, message: "Song added" };
};

export const addSongToPlaylistJSON = (songId: string, playlistId: string) => {
  ensurePlaylistsDirExists();
  const playlists = getAllPlaylists();

  const playlist = playlists.find((playlist) => playlist.id === playlistId);

  if (!playlist) return { success: false, message: "Playlist not found" };

  if (playlist.songs.includes(songId))
    return {
      success: false,
      message: "Song was already added to the playlist.",
    };

  playlist.songs.push(songId);

  savePlaylists(playlists);

  return { success: true, message: "Song added to playlist" };
};

export const deleteSongFromPlaylistJSON = (
  playlistId: string,
  songId: string
) => {
  ensurePlaylistsDirExists();
  const playlists = getAllPlaylists();

  const playlist = playlists.find((playlist) => playlist.id === playlistId);

  if (!playlist)
    return { success: false, message: "There is no playlist with that id" };
  const songs = playlist.songs.filter((song) => song !== songId);
  playlist.songs = songs;
  savePlaylists(playlists);

  return { success: true, message: "Song added to playlist" };
};

export const updatePlaylistFromJSON = async (
  playlistId: string,
  imagePath?: string,
  name?: string
) => {
  const playlists = getAllPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  if (imagePath) {
    const newExtension = path.extname(imagePath);
    const newRelativePath = `/images/playlists/playlist-${playlistId}${newExtension}`;

    if (playlist.image && playlist.image !== newRelativePath) {
      const oldImagePath = path.join(process.cwd(), "public", playlist.image);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error(
            "Error deleting old image with different extension:",
            error
          );
        }
      }
    }

    playlist.image = newRelativePath;
  }

  if (name !== undefined) {
    playlist.name = name;
  }

  savePlaylists(playlists);

  return {
    success: true,
    message: "Playlist updated successfully",
  };
};

export const deletePlaylistFromJSON = (id: string) => {
  ensurePlaylistsDirExists();
  let playlists = getAllPlaylists();

  playlists = playlists.filter((playlist) => playlist.id !== id);

  savePlaylists(playlists);
  return { success: true, message: "Playlist deleted" };
};
