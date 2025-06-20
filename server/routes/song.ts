import express from "express";
import {
  getSongs,
  downloadSong,
  deleteSong,
  markAsFavorite,
} from "../controllers/song.controller";

const router = express.Router();

router.get("/", getSongs);

router.post("/favorite/:songId", markAsFavorite);
router.post("/download", downloadSong);
router.post("/delete", deleteSong);

export default router;
