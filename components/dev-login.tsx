"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function DevLogin() {
  return (
    <a
      href={`${process.env.BASE_URL}/api/auth/dev`}
      className={cn(buttonVariants(), "w-full")}
    >
      Login with Spotify
    </a>
  );
}
