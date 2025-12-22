import { logout } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  await logout();
  return NextResponse.redirect(new URL("/login", process.env.BASE_URL!));
}
