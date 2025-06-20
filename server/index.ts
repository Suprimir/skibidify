import express from "express";
import cors from "cors";
import songRouter from "./routes/song";
import playlistRouter from "./routes/playlist";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/songs", songRouter);
app.use("/api/playlists", playlistRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

export default app;
