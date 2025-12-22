"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BoardSize } from "@/types/song";

interface BoardSizeSelectorProps {
  value: BoardSize;
  onChange: (size: BoardSize) => void;
}

export default function BoardSizeSelector({
  value,
  onChange,
}: BoardSizeSelectorProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(Number(val) as BoardSize)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2">2x2 Grid</SelectItem>
        <SelectItem value="3">3x3 Grid</SelectItem>
        <SelectItem value="4">4x4 Grid</SelectItem>
        <SelectItem value="5">5x5 Grid</SelectItem>
      </SelectContent>
    </Select>
  );
}

