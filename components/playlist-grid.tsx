"use client";

import { SimplifiedPlaylistObject } from "@/generated/Playlists";
import PlaylistCard from "./playlist-card";

interface PlaylistGridProps {
  playlists: SimplifiedPlaylistObject[];
}

export default function PlaylistGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
