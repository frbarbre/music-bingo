"use client";

import type { Song, BoardSize } from "@/types/song";
import { cn } from "@/lib/utils";

interface BingoBoardProps {
  board: Song[];
  size: BoardSize;
}

export default function BingoBoard({ board, size }: BingoBoardProps) {
  return (
    <div
      className={cn(
        "grid border max-w-[560px] mx-auto",
        size === 2 && "grid-cols-2",
        size === 3 && "grid-cols-3",
        size === 4 && "grid-cols-4",
        size === 5 && "grid-cols-5"
      )}
    >
      {board.map((song, index) => (
        <div
          className="border aspect-square flex flex-col items-center justify-center text-center p-2"
          key={`${song.name}-${index}`}
        >
          <span className="text-sm font-bold line-clamp-2">{song.name}</span>
          <span className="text-xs line-clamp-1 text-muted-foreground">
            {song.artists.join(", ")}
          </span>
        </div>
      ))}
    </div>
  );
}

