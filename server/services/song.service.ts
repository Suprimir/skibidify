import ytdlp from "yt-dlp-exec";
import path from "path";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import { YouTubeSearchItem } from "../../src/types/YoutubeSearch";
import { Song } from "../../src/types/Song";
import { getAllPlaylists, savePlaylists } from "./playlist.service";

const documentsDir = path.join(process.cwd(), "public", "songs");
const songsJsonPath = path.join(documentsDir, "songs.json");

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 200);
};
const ensureSongsDirExists = () => {
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }
};

export const getAllSongs = (): Song[] => {
  ensureSongsDirExists();
  if (!fs.existsSync(songsJsonPath)) return [];
  const jsonData = fs.readFileSync(songsJsonPath, "utf8");
  return JSON.parse(jsonData);
};

export const saveSongs = (songs: Song[]) => {
  fs.writeFileSync(songsJsonPath, JSON.stringify(songs, null, 2), "utf8");
};

export const addSong = (
  youtubeItem: YouTubeSearchItem
): { success: boolean; message: string } => {
  ensureSongsDirExists();

  const songs = getAllSongs();

  const exists = songs.find((s) => s.id === youtubeItem.id.videoId);
  if (exists) return { success: false, message: "Song already exists" };

  const relativePath = `/songs/${sanitizeFilename(
    youtubeItem.snippet.title
  )}.mp3`;

  const newSong: Song = {
    id: youtubeItem.id.videoId ?? "",
    title: sanitizeFilename(youtubeItem.snippet.title),
    channelTitle: youtubeItem.snippet.channelTitle,
    description: youtubeItem.snippet.description,
    thumbnailUrl: youtubeItem.snippet.thumbnails?.default?.url,
    filePath: relativePath,
    addedAt: new Date().toISOString(),
    favorite: false,
  };

  songs.push(newSong);
  saveSongs(songs);

  return { success: true, message: "Song added" };
};

export const markAsFavoriteJSON = (songId: string) => {
  ensureSongsDirExists();

  const songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);

  if (!song) return { success: false, message: "Song not found" };

  song.favorite = !song.favorite;

  saveSongs(songs);
  return {
    success: true,
    message: `Song ${song.favorite ? "marked" : "unmarked"} as favorite`,
  };
};

export const deleteSongById = (
  songId: string
): { success: boolean; message: string } => {
  ensureSongsDirExists();

  let songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);

  if (!song) return { success: false, message: "Song not found" };

  try {
    fs.unlinkSync(path.join(process.cwd(), "public", song.filePath));
  } catch (e) {
    console.error("Error deleting file:", e);
  }

  songs = songs.filter((s) => s.id !== songId);

  let playlists = getAllPlaylists();

  playlists = playlists.map((playlist) => ({
    ...playlist,
    songs: playlist.songs.filter((song) => song !== songId),
  }));

  saveSongs(songs);
  savePlaylists(playlists);

  return { success: true, message: "Song deleted" };
};

export const downloadSongToDisk = async (
  youtubeItem: YouTubeSearchItem
): Promise<string> => {
  ensureSongsDirExists();
  const url = `https://www.youtube.com/watch?v=${youtubeItem.id.videoId}`;
  const outputPath = path.join(
    documentsDir,
    `${sanitizeFilename(youtubeItem.snippet.title)}.mp3`
  );

  try {
    await ytdlp(url, {
      format: "bestaudio",
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: outputPath,
      ffmpegLocation: ffmpegPath ?? undefined,
    });

    return outputPath;
  } catch (error) {
    console.error("ytdlp failed:", error);

    throw new Error(
      `Failed to download video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
