import { useApiKeys } from "./useApiKeys";

export const useYoutube = () => {
  const { getApiKey, hasApiKey } = useApiKeys();

  const searchSongs = async (searchTerm: string) => {
    const apiKey = getApiKey("YouTube");
    if (!apiKey) {
      throw new Error("YouTube API key not found");
    }

    console.log("API Youtube Ejecutada");

    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      searchTerm
    )}&videoCategoryId=10&maxResults=10&order=relevance&key=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching YouTube:", error);
      throw error;
    }
  };

  return {
    searchSongs,
    hasYouTubeKey: hasApiKey("YouTube"),
    isConfigured: hasApiKey("YouTube"),
  };
};
