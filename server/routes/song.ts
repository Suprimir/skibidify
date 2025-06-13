import express from "express";
import { downloadSong, getSongs } from "../services/song.service";

const router = express.Router();

router.get("/", getSongs);
router.post("/download", downloadSong);

export default router;
