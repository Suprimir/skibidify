import express from "express";
import {
  getSongs,
  downloadSong,
  deleteSong,
} from "../controllers/song.controller";

const router = express.Router();

router.get("/", getSongs);
router.post("/download", downloadSong);
router.post("/delete", deleteSong);

export default router;
