"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrinterIcon, LoaderIcon } from "lucide-react";
import type { Song, BoardSize } from "@/types/song";
import { generateBingoPDF } from "@/lib/pdf-generator";

interface PrintDialogProps {
  songs: Song[];
  boardSize: BoardSize;
  playlistName: string;
}

export default function PrintDialog({
  songs,
  boardSize,
  playlistName,
}: PrintDialogProps) {
  const [open, setOpen] = useState(false);
  const [numberOfBoards, setNumberOfBoards] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    // Validate input is a number
    const num = parseInt(numberOfBoards, 10);
    
    if (isNaN(num)) {
      setError("Please enter a valid number");
      return;
    }
    
    if (num < 1 || num > 100) {
      setError("Please enter a number between 1 and 100");
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      await generateBingoPDF({
        songs,
        boardSize,
        numberOfBoards: num,
        playlistName,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <PrinterIcon />
          Print
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Print Bingo Boards</AlertDialogTitle>
          <AlertDialogDescription>
            Generate PDF with multiple bingo boards. Each board will be on a
            separate A4 page.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="boardCount">Number of boards</Label>
            <Input
              id="boardCount"
              type="text"
              value={numberOfBoards}
              onChange={(e) => {
                setNumberOfBoards(e.target.value);
                setError("");
              }}
              placeholder="Enter number of boards (1-100)"
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Current board size: {boardSize}x{boardSize}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <LoaderIcon className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PrinterIcon />
                Generate PDF
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

