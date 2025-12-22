import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  ErrorObject,
  ExternalUrlObject,
  FollowersObject,
  ImageObject,
  PagingObject,
  SimplifiedAlbumObject,
  TrackObject,
} from "./common";

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
type PagingArtistDiscographyAlbumObject = PagingObject &
  Partial<{
    items: Array<ArtistDiscographyAlbumObject>;
  }>;
type ArtistDiscographyAlbumObject = SimplifiedAlbumObject & {
  album_group: "album" | "single" | "compilation" | "appears_on";
};

const ArtistObject: z.ZodType<ArtistObject> = z
  .object({
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    genres: z.array(z.string()),
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    name: z.string(),
    popularity: z.number().int(),
    type: z.literal("artist"),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const ArtistDiscographyAlbumObject = SimplifiedAlbumObject.and(
  z
    .object({
      album_group: z.enum(["album", "single", "compilation", "appears_on"]),
    })
    .passthrough()
);
const PagingArtistDiscographyAlbumObject: z.ZodType<PagingArtistDiscographyAlbumObject> =
  PagingObject.and(
    z
      .object({ items: z.array(ArtistDiscographyAlbumObject) })
      .partial()
      .passthrough()
  );

export const schemas = {
  ArtistObject,
  ArtistDiscographyAlbumObject,
  PagingArtistDiscographyAlbumObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/artists/:id",
    alias: "get-an-artist",
    description: `Get Spotify catalog information for a single artist identified by their unique Spotify ID.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ArtistObject,
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
  {
    method: "get",
    path: "/artists",
    alias: "get-multiple-artists",
    description: `Get Spotify catalog information for several artists based on their Spotify IDs.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.object({ artists: z.array(ArtistObject) }).passthrough(),
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
  {
    method: "get",
    path: "/artists/:id/albums",
    alias: "get-an-artists-albums",
    description: `Get Spotify catalog information about an artist&#x27;s albums.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "include_groups",
        type: "Query",
        schema: z.string().optional(),
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
        schema: z.number().int().optional().default(0),
      },
    ],
    response: PagingArtistDiscographyAlbumObject,
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
  {
    method: "get",
    path: "/artists/:id/top-tracks",
    alias: "get-an-artists-top-tracks",
    description: `Get Spotify catalog information about an artist&#x27;s top tracks by country.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.object({ tracks: z.array(TrackObject) }).passthrough(),
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

export const ArtistsApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
