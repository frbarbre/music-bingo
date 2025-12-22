"use client";

import { useState, useMemo } from "react";
import type { Song } from "@/types/song";
import Image from "next/image";
import { CheckIcon, SearchIcon, XIcon, RotateCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SongListProps {
  songs: Song[];
  playlistId: string;
  checkedSongs: Set<string>;
  onToggle: (songId: string) => void;
  onReset: () => void;
}

export function SongList({ songs, playlistId, checkedSongs, onToggle, onReset }: SongListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getSongId = (song: Song, index: number) => {
    return `${song.name}-${song.artists.join(",")}-${index}`;
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;

    const query = searchQuery.toLowerCase();
    return songs.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.artists.some((artist) => artist.toLowerCase().includes(query)) ||
        song.album.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="default">
              <RotateCcwIcon />
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Checked Songs?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all checked songs for this playlist. Your board
                and board size will remain unchanged. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReset} variant="destructive">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {filteredSongs.length > 0 ? (
        <>
          {searchQuery && (
            <p className="text-sm text-muted-foreground text-center">
              Showing {filteredSongs.length} of {songs.length} songs
            </p>
          )}
          <div className="space-y-2">
            {filteredSongs.map((song, index) => {
              // Get original index for consistent song IDs
              const originalIndex = songs.indexOf(song);
              const songId = getSongId(song, originalIndex);
              const isChecked = checkedSongs.has(songId);

              return (
                <button
                  key={songId}
                  onClick={() => onToggle(songId)}
                  className={cn(
                    "flex w-full items-center gap-4 p-3 rounded-none border transition-all text-left",
                    isChecked
                      ? "bg-primary/20 border-primary opacity-60"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden">
                    <Image
                      src={song.image}
                      alt={song.album}
                      width={48}
                      height={48}
                      className="object-cover"
                      unoptimized
                    />
                    {isChecked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                        <CheckIcon className="size-6 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold truncate",
                        isChecked && "line-through"
                      )}
                    >
                      {song.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artists.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate">
                      {song.album}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isChecked
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isChecked && (
                      <CheckIcon className="size-4 text-primary-foreground" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <p>No songs found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

