"use client";

import { useEffect } from "react";
import Link from "next/link";
import usePlaylist from "@/hooks/usePlaylist";
import { useGameStore } from "@/stores/game-store";
import type { Song } from "@/types/song";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import BingoBoard from "@/components/bingo-board";
import { SongList } from "@/components/song-list";
import BoardSizeSelector from "@/components/board-size-selector";
import PrintDialog from "@/components/print-dialog";
import ReloadButton from "@/components/reload-button";
import { cn } from "@/lib/utils";

interface ClientProps {
  id: string;
}

export default function Client({ id }: ClientProps) {
  const { playlist } = usePlaylist({ id });
  const {
    showList,
    currentTab,
    checkedSongs,
    setBoardSize,
    setCurrentTab,
    generateBoard,
    toggleSongCheck,
    resetGame,
    getBoardSize,
    getCurrentBoard,
  } = useGameStore();

  // Get playlist-specific state
  const boardSize = getBoardSize(id);
  const currentBoard = getCurrentBoard(id);

  // Extract songs from playlist
  const songs: Song[] =
    playlist.data?.tracks?.items
      ?.filter((item) => item.track && item.track.type === "track")
      .map((item) => {
        const track = item.track!;
        return {
          name: track.name || "Unknown Track",
          artists:
            ("artists" in track ? track.artists : [])?.map(
              (a: { name?: string }) => a.name || "Unknown Artist"
            ) || [],
          album:
            ("album" in track ? track.album?.name : undefined) ||
            "Unknown Album",
          image:
            ("album" in track ? track.album?.images?.[0]?.url : undefined) ||
            "",
        };
      }) || [];

  // Generate board on mount if empty
  useEffect(() => {
    if (currentBoard.length === 0 && songs.length > 0) {
      generateBoard(id, songs, boardSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs.length, currentBoard.length, boardSize, id]);

  if (playlist.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading playlist...</div>
      </div>
    );
  }

  if (playlist.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Failed to load playlist</h1>
          <p className="text-muted-foreground">
            There was an error loading the playlist. Please try again.
          </p>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!playlist.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">No playlist found</div>
      </div>
    );
  }

  const handleBoardSizeChange = (size: typeof boardSize) => {
    setBoardSize(id, size);
    generateBoard(id, songs, size);
  };

  const handleReload = () => {
    generateBoard(id, songs, boardSize);
  };

  const handleReset = () => {
    // Only reset checked songs, board remains unchanged
    resetGame(id);
  };

  const handleToggleSong = (songId: string) => {
    toggleSongCheck(id, songId);
  };

  const playlistCheckedSongs = checkedSongs[id] || new Set<string>();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{playlist.data.name}</h1>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            ← Back
          </Link>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              <BoardSizeSelector
                value={boardSize}
                onChange={handleBoardSizeChange}
              />
              <PrintDialog
                songs={songs}
                boardSize={boardSize}
                playlistName={playlist.data.name || "Bingo"}
              />
            </div>
          </div>

          <TabsContent value="board">
            <div className="space-y-6">
              <div className="flex justify-center">
                <ReloadButton songs={songs} onReload={handleReload} />
              </div>

              {currentBoard.length > 0 ? (
                <BingoBoard board={currentBoard} size={boardSize} />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  No board generated yet
                </div>
              )}

              {showList && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    All Songs ({songs.length})
                  </h2>
                  <SongList
                    songs={songs}
                    playlistId={id}
                    checkedSongs={playlistCheckedSongs}
                    onToggle={handleToggleSong}
                    onReset={handleReset}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                All Songs ({playlistCheckedSongs.size}/{songs.length} checked)
              </h2>
              <SongList
                songs={songs}
                playlistId={id}
                checkedSongs={playlistCheckedSongs}
                onToggle={handleToggleSong}
                onReset={handleReset}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
