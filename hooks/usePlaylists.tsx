import { PagingPlaylistObject } from "@/generated/Playlists";
import { useQuery } from "@tanstack/react-query";

export default function usePlaylists(offset: number = 0, limit: number = 20) {
  const playlists = useQuery({
    queryKey: ["playlist", offset, limit],
    queryFn: async (): Promise<PagingPlaylistObject> => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });
      return fetch(`/api/spotify/playlist?${params}`).then(async (res) => {
        const data = await res.json();
        return data;
      });
    },
  });

  return { playlists };
}
