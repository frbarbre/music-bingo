"use client";

import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import type { Song } from "@/types/song";

interface ReloadButtonProps {
  songs: Song[];
  onReload: (songs: Song[]) => void;
}

export default function ReloadButton({ songs, onReload }: ReloadButtonProps) {
  return (
    <Button variant="outline" onClick={() => onReload(songs)}>
      <RefreshCwIcon />
      Reload
    </Button>
  );
}

