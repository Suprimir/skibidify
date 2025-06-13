import ytdlp from "yt-dlp-exec";
import path from "path";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import { RequestHandler } from "express";
import { YouTubeSearchItem } from "../../types/YoutubeSearch";
import { Song } from "../../types/Song";

export const getSongs: RequestHandler = (req, res) => {
  const documentsDir = path.join(process.cwd(), "public", "songs");
  const songsJsonPath = path.join(documentsDir, "songs.json");

  try {
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    let songs: Song[] = [];
    if (fs.existsSync(songsJsonPath)) {
      const jsonData = fs.readFileSync(songsJsonPath, "utf8");
      songs = JSON.parse(jsonData);
    }

    res.status(200).send(songs);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addSong = (youtubeItem: YouTubeSearchItem) => {
  const documentsDir = path.join(process.cwd(), "public", "songs");
  const songsJsonPath = path.join(documentsDir, "songs.json");

  try {
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    let songs: Song[] = [];
    if (fs.existsSync(songsJsonPath)) {
      const jsonData = fs.readFileSync(songsJsonPath, "utf8");
      songs = JSON.parse(jsonData);
    }

    const existingSong = songs.find(
      (song) => song.id === youtubeItem.id.videoId
    );
    if (existingSong) {
      console.log(
        `La canción "${youtubeItem.snippet.title}" ya existe en la lista`
      );
      return { success: false, message: "Song already exists" };
    }

    const relativePath = `/public/songs/${youtubeItem.snippet.title}.mp3`;

    const newSong: Song = {
      id: youtubeItem.id.videoId ?? "",
      title: youtubeItem.snippet.title,
      channelTitle: youtubeItem.snippet.channelTitle,
      description: youtubeItem.snippet.description,
      thumbnailUrl: youtubeItem.snippet.thumbnails?.default?.url,
      filePath: relativePath,
      addedAt: new Date().toISOString(),
    };

    songs.push(newSong);

    fs.writeFileSync(songsJsonPath, JSON.stringify(songs, null, 2), "utf8");

    console.log(`Canción "${newSong.title}" agregada exitosamente al JSON`);
  } catch (error) {
    console.error("Error al agregar la canción al JSON:", error);
  }
};

export const downloadSong: RequestHandler = async (req, res) => {
  const youtubeItem = req.body.youtubeItem as YouTubeSearchItem;

  if (!youtubeItem.id.videoId) {
    res.status(400).json({ error: "Missing videoId" });
    return;
  }

  const url = `https://www.youtube.com/watch?v=${youtubeItem.id.videoId}`;

  const documentsDir = path.join(process.cwd(), "public", "songs");
  const outputPath = path.join(
    documentsDir,
    `${youtubeItem.snippet.title}.mp3`
  );

  try {
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    await ytdlp(url, {
      format: "bestaudio",
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: outputPath,
      ffmpegLocation: ffmpegPath ?? undefined,
    });

    addSong(youtubeItem);

    res.status(200).json({
      message: "Descarga completada",
      savedTo: outputPath,
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download audio" });
  }
};
