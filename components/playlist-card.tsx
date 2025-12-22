"use client";

import Link from "next/link";
import Image from "next/image";
import { SimplifiedPlaylistObject } from "@/generated/Playlists";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music2Icon } from "lucide-react";

interface PlaylistCardProps {
  playlist: SimplifiedPlaylistObject;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/${playlist.id}`}
      className="group block transition-all hover:scale-[1.02]"
    >
      <Card className="flex h-full flex-col overflow-hidden border-0 bg-muted/30 p-0 transition-all hover:bg-muted/50">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {playlist.images && playlist.images.length > 0 && playlist.images[0]?.url ? (
            <Image
              src={playlist.images[0].url}
              alt={playlist.name || "Playlist"}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Music2Icon className="size-12 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <CardHeader className="flex flex-1 flex-col gap-1 p-4">
          <CardTitle className="line-clamp-2 text-sm font-semibold leading-tight">
            {playlist.name || "Untitled Playlist"}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs leading-tight">
            {playlist.description || `${playlist.tracks?.total || 0} track${playlist.tracks?.total !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

