import type { YouTubeSearchResponse } from "@/types/YoutubeSearch";
import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "src/components/SearchResults/SearchBar";
import SearchResultCard from "src/components/SearchResults/SearchResultCard";
import { useYoutube } from "src/hooks/useYoutube";

export default function SearchView() {
  const [youtubeSearchResponse, setYoutubeSearchResponse] =
    useState<YouTubeSearchResponse>();
  const [selectedProvider, setSelectedProvider] = useState<
    "YouTube" | "Bandcamp"
  >("YouTube");
  const { searchSongs, isConfigured } = useYoutube();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      const youtubeSearchResponse: YouTubeSearchResponse | null =
        await searchSongs(searchTerm);

      if (youtubeSearchResponse)
        setYoutubeSearchResponse(youtubeSearchResponse);
    },
    [searchSongs]
  );

  useEffect(() => {
    if (!searchTerm) return;

    handleSearch(searchTerm);
  }, [isConfigured, searchTerm]);

  return (
    <div className="space-y-2 pb-8">
      <div className="flex items-center gap-4">
        <h1 className="flex items-center gap-4 font-extrabold text-4xl text-primary-600 px-2 py-4">
          <Download className="w-10 h-10" />
          Descargar
        </h1>
        <button
          onClick={() => setSelectedProvider("YouTube")}
          className={`cursor-pointer flex items-center gap-3 ${
            selectedProvider === "YouTube"
              ? "bg-primary-200 border-primary-300"
              : "bg-primary-100 border-primary-200"
          } text-primary-600 rounded-full px-3 py-2 border-2 transition-all duration-300 hover:scale-105 active:scale-95`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube
        </button>
        <button
          onClick={() => setSelectedProvider("Bandcamp")}
          className={`cursor-pointer flex items-center gap-3 bg-primary-100 text-primary-600 rounded-full px-3 py-2 border-2 border-primary-200 ${
            selectedProvider === "Bandcamp"
              ? "bg-primary-200 border-primary-300"
              : "bg-primary-100 border-primary-200"
          } transition-all duration-300 hover:scale-105 active:scale-95`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 18.75l7.437-13.5h16.563l-7.438 13.5z" />
          </svg>
          Bandcamp
        </button>
      </div>
      <SearchBar submit={(searchTerm) => setSearchParams({ q: searchTerm })} />
      {youtubeSearchResponse &&
        youtubeSearchResponse.items.map((item) => (
          <SearchResultCard key={item.id.videoId} youtubeItem={item} />
        ))}
    </div>
  );
}
