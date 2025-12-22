"use client";

import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button variant="outline" onClick={onReset}>
      <RotateCcwIcon />
      Reset
    </Button>
  );
}

