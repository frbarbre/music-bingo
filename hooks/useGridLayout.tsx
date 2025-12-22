"use client";

import { useEffect, useState } from "react";

export default function useGridLayout() {
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const calculateLimit = () => {
      const width = window.innerWidth;
      const rows = 4; // Number of rows to show

      let columns = 2; // default mobile
      if (width >= 1280) columns = 6; // xl
      else if (width >= 1024) columns = 5; // lg
      else if (width >= 768) columns = 4; // md
      else if (width >= 640) columns = 3; // sm

      return columns * rows;
    };

    setLimit(calculateLimit());

    const handleResize = () => {
      setLimit(calculateLimit());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return limit;
}

