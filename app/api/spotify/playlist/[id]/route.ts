import { PlaylistsApi } from "@/generated";
import { getSession } from "@/lib";
import { getAccessToken } from "@/utils/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const accessToken = await getAccessToken(session.refreshToken);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const playlist = await PlaylistsApi["get-playlist"]({
      params: { playlist_id: id },
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
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
