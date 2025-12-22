import { PagingPlaylistObject } from "@/generated/Playlists";
import { useQuery } from "@tanstack/react-query";

export default function usePlaylists() {
  const playlists = useQuery({
    queryKey: ["playlist"],
    queryFn: async (): Promise<PagingPlaylistObject> => {
      return fetch("/api/spotify/playlist").then(async (res) => {
        const data = await res.json();
        return data;
      });
    },
  });

  return { playlists };
}
