import express from "express";
import multer from "multer";
import path from "path";
import {
  addPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
  getPlaylists,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = express.Router();

/* 
    Configuracion del almacenamiento donde se subiran las 
    imagenes en esta ruta, como solo se subiran imagenes para
    playlists le colocamos directamente el nombre al archivo como
    [playlist-{playlistId}.ext]
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public", "images", "playlists");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `playlist-${req.params.playlistId}${path.extname(file.originalname)}`
    );
  },
});

/* 
    Configuramos el upload utilizando el almacenamiento 
    creado anteriormente y colocamos limites y filtros
*/
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Endpoint Playlists
router.put("/:playlistId", upload.single("image"), updatePlaylist);
router.get("/", getPlaylists);
router.post("/", addPlaylist);
router.delete("/", deletePlaylist);

router.post("/song", addSongToPlaylist);
router.delete("/song/:playlistId", deleteSongFromPlaylist);

export default router;
