import express from "express";
import {
  addPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  getPlaylists,
} from "../controllers/playlist.controller";

const router = express.Router();

// Endpoint Playlists
router.get("/", getPlaylists);
router.post("/", addPlaylist);

router.delete("/", deletePlaylist);

router.post("/song", addSongToPlaylist);

export default router;
