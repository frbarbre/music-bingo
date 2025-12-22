import { PlaylistObject } from "@/generated/Playlists";
import { useQuery } from "@tanstack/react-query";

export default function usePlaylist({ id }: { id: string }) {
  const playlist = useQuery({
    queryKey: ["playlist", id],
    queryFn: async (): Promise<PlaylistObject> => {
      return fetch(`/api/spotify/playlist/${id}`).then(async (res) => {
        const data = await res.json();
        return data;
      });
    },
  });

  return { playlist };
}
