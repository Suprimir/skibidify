import { RequestHandler } from "express";
import {
  getAllSongs,
  addSong,
  deleteSongById,
  downloadSongToDisk,
  markAsFavoriteJSON,
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
    res.status(400).json({
      error: "Missing videoId",
      message: "YouTubeItem with valid videoId is required",
    });
    return;
  }

  try {
    const outputPath = await downloadSongToDisk(youtubeItem);
    const result = addSong(youtubeItem);

    if (!result.success) {
      res.status(409).json(result);
      return;
    }

    res.status(200).json({
      message: "Downloaded successfully",
      path: outputPath,
      success: true,
    });
  } catch (err) {
    console.error("Download error:", err);

    if (err instanceof Error) {
      if (
        err.message.includes("video unavailable") ||
        err.message.includes("Video unavailable")
      ) {
        res.status(404).json({
          error: "Video not found or unavailable",
          message:
            "The requested video could not be found or is not available for download",
        });
      } else if (
        err.message.includes("network") ||
        err.message.includes("timeout")
      ) {
        res.status(503).json({
          error: "Network error",
          message:
            "Failed to download due to network issues. Please try again later.",
        });
      } else if (err.message.includes("ffmpeg")) {
        res.status(500).json({
          error: "Audio conversion failed",
          message:
            "Failed to convert audio format. Please check FFmpeg installation.",
        });
      } else {
        res.status(500).json({
          error: "Download failed",
          message: err.message || "An unknown error occurred during download",
        });
      }
    } else {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
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

export const markAsFavorite: RequestHandler = (req, res) => {
  const { songId } = req.params;

  try {
    const data = markAsFavoriteJSON(songId);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to mark as favorite" });
  }
};
