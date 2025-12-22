"use client";

import { useEffect } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import usePlaylists from "@/hooks/usePlaylists";
import useGridLayout from "@/hooks/useGridLayout";
import PlaylistGrid from "@/components/playlist-grid";
import PlaylistPagination from "@/components/playlist-pagination";

export default function Client() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const limit = useGridLayout();
  const offset = (page - 1) * limit;

  const { playlists } = usePlaylists(offset, limit);

  // Reset to page 1 if current page is out of bounds after limit change
  useEffect(() => {
    if (playlists.data?.total) {
      const totalPages = Math.ceil(playlists.data.total / limit);
      if (page > totalPages) {
        setPage(1);
      }
    }
  }, [limit, playlists.data?.total, page, setPage]);

  if (playlists.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading playlists...</div>
      </div>
    );
  }

  if (playlists.isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-destructive">Failed to load playlists</div>
      </div>
    );
  }

  const playlistData = playlists.data;
  const items = playlistData?.items || [];
  const total = playlistData?.total || 0;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">No playlists found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Playlists</h1>
      <PlaylistGrid playlists={items} />
      <PlaylistPagination
        total={total}
        limit={limit}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
