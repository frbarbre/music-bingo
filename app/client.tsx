"use client";

import usePlaylists from "@/hooks/usePlaylists";

export default function Client() {
  const { playlists } = usePlaylists();
  return (
    <>
      <pre>{JSON.stringify(playlists.data, null, 2)}</pre>
    </>
  );
}
