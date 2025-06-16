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

const savePlaylists = (playlists: Playlist[]) => {
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

export const addPlaylistToJSON = () => {
  ensurePlaylistsDirExists();
  const playlists = getAllPlaylists();

  const newPlaylist: Playlist = {
    id: randomUUID(),
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

  if (playlist) playlist.songs.push(songId);

  savePlaylists(playlists);

  return { success: true, message: "Song added to playlist" };
};

export const deletePlaylistFromJSON = (id: string) => {
  ensurePlaylistsDirExists();
  let playlists = getAllPlaylists();

  playlists = playlists.filter((playlist) => playlist.id !== id);

  savePlaylists(playlists);
  return { success: true, message: "Playlist deleted" };
};
