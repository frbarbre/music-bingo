import { login } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await login(process.env.TEST_REFRESH_TOKEN!);

  return NextResponse.redirect(new URL("/", process.env.BASE_URL!));
}
