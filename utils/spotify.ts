"use server";

export async function getAccessToken(refresh_token: string) {
  const { url, ...init } = getTokenReqConfig({
    grant_type: "refresh_token",
    refresh_token,
  });

  return fetch(url, init).then((res) => res.json());
}

function getTokenReqConfig(body: { [key: string]: string }) {
  const BASIC = Buffer.from(
    `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
  ).toString("base64");

  return {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${BASIC}`,
    },
    body: new URLSearchParams(body),
  };
}
