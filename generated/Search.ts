import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  ErrorObject,
  PagingObject,
  TrackObject,
  SimplifiedShowObject,
  FollowersObject,
  ImageObject,
  ExternalUrlObject,
} from "./common";
import { schemas as AlbumsSchemas } from "./Albums";
import { schemas as ArtistsSchemas } from "./Artists";
import { schemas as PlaylistsSchemas } from "./Playlists";
import { schemas as ShowsSchemas } from "./Shows";
import { schemas as AudiobooksSchemas } from "./Audiobooks";

type ArtistObject = Partial<{
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}>;
type PagingTrackObject = PagingObject & Partial<{ items: Array<TrackObject> }>;
type PagingArtistObject = PagingObject &
  Partial<{ items: Array<ArtistObject> }>;
type PagingSimplifiedShowObject = PagingObject &
  Partial<{ items: Array<SimplifiedShowObject> }>;

const PagingTrackObject: z.ZodType<PagingTrackObject> = PagingObject.and(
  z
    .object({ items: z.array(TrackObject) })
    .partial()
    .passthrough()
);
const PagingArtistObject: z.ZodType<PagingArtistObject> = PagingObject.and(
  z
    .object({ items: z.array(ArtistsSchemas.ArtistObject) })
    .partial()
    .passthrough()
);
const PagingSimplifiedShowObject: z.ZodType<PagingSimplifiedShowObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedShowObject) })
      .partial()
      .passthrough()
  );

const endpoints = makeApi([
  {
    method: "get",
    path: "/search",
    alias: "search",
    description: `Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks
that match a keyword string. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "q",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.array(
          z.enum([
            "album",
            "artist",
            "playlist",
            "track",
            "show",
            "episode",
            "audiobook",
          ])
        ),
      },
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(0).lte(50).optional().default(20),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().gte(0).lte(1000).optional().default(0),
      },
      {
        name: "include_external",
        type: "Query",
        schema: z.literal("audio").optional(),
      },
    ],
    response: z
      .object({
        tracks: PagingTrackObject,
        artists: PagingArtistObject,
        albums: AlbumsSchemas.PagingSimplifiedAlbumObject,
        playlists: PlaylistsSchemas.PagingPlaylistObject,
        shows: PagingSimplifiedShowObject,
        episodes: ShowsSchemas.PagingSimplifiedEpisodeObject,
        audiobooks: AudiobooksSchemas.PagingSimplifiedAudiobookObject,
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Bad or expired token. This can happen if the user revoked a token or
the access token has expired. You should re-authenticate the user.
`,
        schema: z.object({ error: ErrorObject }).passthrough(),
      },
      {
        status: 403,
        description: `Bad OAuth request (wrong consumer key, bad nonce, expired
timestamp...). Unfortunately, re-authenticating the user won&#x27;t help here.
`,
        schema: z.object({ error: ErrorObject }).passthrough(),
      },
      {
        status: 429,
        description: `The app has exceeded its rate limits.
`,
        schema: z.object({ error: ErrorObject }).passthrough(),
      },
    ],
  },
]);

export const SearchApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
