import jsPDF from "jspdf";
import type { Song, BoardSize } from "@/types/song";

interface GeneratePDFOptions {
  songs: Song[];
  boardSize: BoardSize;
  numberOfBoards: number;
  playlistName: string;
}

function generateRandomBoard(songs: Song[], size: BoardSize): Song[] {
  const requiredSongs = size * size;
  return [...songs].sort(() => 0.5 - Math.random()).slice(0, requiredSongs);
}

export async function generateBingoPDF({
  songs,
  boardSize,
  numberOfBoards,
  playlistName,
}: GeneratePDFOptions) {
  // A4 size in points: 595.28 x 841.89
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // Page dimensions
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Margins
  const margin = 40;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  // Title height
  const titleHeight = 40;
  const availableHeight = contentHeight - titleHeight - 20; // 20pt gap after title

  // Calculate cell size based on board size
  const gridSize = Math.min(contentWidth, availableHeight);
  const cellSize = gridSize / boardSize;

  for (let boardIndex = 0; boardIndex < numberOfBoards; boardIndex++) {
    if (boardIndex > 0) {
      doc.addPage();
    }

    // Generate a random board
    const board = generateRandomBoard(songs, boardSize);

    // Calculate starting positions to center the grid
    const gridWidth = cellSize * boardSize;
    const gridHeight = cellSize * boardSize;
    const startX = margin + (contentWidth - gridWidth) / 2;
    const startY = margin + titleHeight + 20;

    // Draw title
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${playlistName} - Board ${boardIndex + 1}`,
      pageWidth / 2,
      margin + 20,
      { align: "center" }
    );

    // Draw grid and fill cells
    doc.setFont("helvetica", "normal");
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0);

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const index = row * boardSize + col;
        const song = board[index];

        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        // Draw cell border
        doc.rect(x, y, cellSize, cellSize);

        if (song) {
          // Calculate text positions
          const cellCenterX = x + cellSize / 2;
          const cellCenterY = y + cellSize / 2;

          // Song name - bold and larger
          doc.setFont("helvetica", "bold");
          doc.setFontSize(Math.max(8, 12 - boardSize));

          const songNameLines = doc.splitTextToSize(
            song.name,
            cellSize - 10
          );
          const songNameHeight = songNameLines.length * (12 - boardSize);

          // Artists - smaller and regular
          doc.setFont("helvetica", "normal");
          doc.setFontSize(Math.max(6, 9 - boardSize));

          const artistText = song.artists.join(", ");
          const artistLines = doc.splitTextToSize(artistText, cellSize - 10);
          const artistHeight = artistLines.length * (9 - boardSize);

          // Total text height
          const totalTextHeight = songNameHeight + artistHeight + 5;
          const textStartY = cellCenterY - totalTextHeight / 2;

          // Draw song name
          doc.setFont("helvetica", "bold");
          doc.setFontSize(Math.max(8, 12 - boardSize));
          doc.text(songNameLines, cellCenterX, textStartY, {
            align: "center",
            maxWidth: cellSize - 10,
          });

          // Draw artists
          doc.setFont("helvetica", "normal");
          doc.setFontSize(Math.max(6, 9 - boardSize));
          doc.text(
            artistLines,
            cellCenterX,
            textStartY + songNameHeight + 5,
            {
              align: "center",
              maxWidth: cellSize - 10,
            }
          );
        }
      }
    }
  }

  // Save the PDF
  const fileName = `${playlistName.replace(/[^a-z0-9]/gi, "_")}_bingo_boards.pdf`;
  doc.save(fileName);
}

