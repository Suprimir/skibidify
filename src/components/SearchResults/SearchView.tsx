// MAIN COMPONENT

import { useSongs } from "@Contexts/SongContext";
import type { YouTubeSearchResponse } from "@Types/YoutubeSearch";
import { useState } from "react";
import { searchSongsYoutube } from "src/api/searchSongsYoutube";
import SearchBar from "src/components/SearchResults/SearchBar";
import SearchResultCard from "src/components/SearchResults/SearchResultCard";

export default function SearchView() {
  const [youtubeSearchResponse, setYoutubeSearchResponse] =
    useState<YouTubeSearchResponse>();
  const { downloadingId } = useSongs();

  const handleSearch = async (searchTerm: string) => {
    const youtubeSearchResponse: YouTubeSearchResponse | null =
      await searchSongsYoutube(searchTerm);

    if (youtubeSearchResponse) setYoutubeSearchResponse(youtubeSearchResponse);
  };
  return (
    <div className="space-y-2">
      <SearchBar submit={(searchTerm) => handleSearch(searchTerm)} />
      {youtubeSearchResponse &&
        youtubeSearchResponse.items.map((item) => (
          <SearchResultCard
            downloadingId={downloadingId}
            key={item.id.videoId}
            youtubeItem={item}
          />
        ))}
    </div>
  );
}
