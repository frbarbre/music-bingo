"use client";

import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint}>
      <PrinterIcon />
      Print
    </Button>
  );
}

