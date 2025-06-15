import { RequestHandler } from "express";
import {
  getAllSongs,
  addSong,
  deleteSongById,
  downloadSongToDisk,
} from "../services/song.service";

export const getSongs: RequestHandler = (req, res) => {
  try {
    const songs = getAllSongs();
    res.status(200).json(songs);
  } catch {
    res.status(500).json({ error: "Failed to load songs" });
  }
};

export const downloadSong: RequestHandler = async (req, res) => {
  const youtubeItem = req.body.youtubeItem;

  if (!youtubeItem?.id?.videoId) {
    res.status(400).json({ error: "Missing videoId" });
    return;
  }

  try {
    const outputPath = await downloadSongToDisk(youtubeItem);
    const result = addSong(youtubeItem);

    if (!result.success) {
      res.status(409).json(result);
    }

    res
      .status(200)
      .json({ message: "Downloaded successfully", path: outputPath });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download" });
  }
};

export const deleteSong: RequestHandler = (req, res) => {
  const songId = req.body.songId;

  if (!songId) {
    res.status(400).json({ error: "Missing songId" });
  }

  const result = deleteSongById(songId);

  if (!result.success) {
    res.status(404).json(result);
  }

  res.status(200).json(result);
};
