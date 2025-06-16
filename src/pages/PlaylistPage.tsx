import PlaylistView from "src/components/Playlist/PlaylistView";
import { useSearchParams } from "react-router-dom";

export default function PlaylistPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  return <PlaylistView id={id} />;
}
