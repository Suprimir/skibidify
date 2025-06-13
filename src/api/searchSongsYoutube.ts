import type { YouTubeSearchResponse } from "../types/YoutubeSearch";

export async function searchSongsYoutube(searchTerm: string) {
  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchTerm}&videoCategoryId=10&maxResults=10&order=relevance&key=${apiKey}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      console.error("YouTube API error:", res.statusText);
      return null;
    }

    const youtubeSearch: YouTubeSearchResponse = await res.json();
    return youtubeSearch;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
