import { PlaylistsApi } from "@/generated";
import { getSession } from "@/lib";
import { getAccessToken } from "@/utils/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = request.nextUrl.searchParams.get("limit") || 50;
  const offset = request.nextUrl.searchParams.get("offset") || 0;

  const accessToken = await getAccessToken(session.refreshToken);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const playlist = await PlaylistsApi[
      "get-a-list-of-current-users-playlists"
    ]({
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      queries: {
        limit: Number(limit),
        offset: Number(offset),
      },
    });

    return NextResponse.json(playlist, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get playlist" },
      { status: 500 }
    );
  }
}
