import { RequestHandler } from "express";
import {
  addPlaylistToJSON,
  addSongToPlaylistJSON,
  deletePlaylistFromJSON,
  getAllPlaylists,
} from "../services/playlist.service";

export const getPlaylists: RequestHandler = (req, res) => {
  try {
    const playlists = getAllPlaylists();
    res.status(200).json(playlists);
  } catch {
    res.status(500).json({ error: "Failed to load playlists" });
  }
};

export const addPlaylist: RequestHandler = (req, res) => {
  try {
    const data = addPlaylistToJSON();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to add playlist" });
  }
};

export const deletePlaylist: RequestHandler = (req, res) => {
  const playlistId = req.body.playlistId;
  try {
    const data = deletePlaylistFromJSON(playlistId);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

export const addSongToPlaylist: RequestHandler = (req, res) => {
  const { songId, playlistId } = req.body;

  try {
    const data = addSongToPlaylistJSON(songId, playlistId);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to add song to playlist" });
  }
};
