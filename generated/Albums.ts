import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  AlbumBase,
  CopyrightObject,
  ErrorObject,
  ExternalIdObject,
  ExternalUrlObject,
  PagingObject,
  SimplifiedAlbumObject,
  SimplifiedArtistObject,
  TrackRestrictionObject,
} from "./common";

type AlbumObject = AlbumBase &
  Partial<{
    artists: Array<SimplifiedArtistObject>;
    tracks: PagingSimplifiedTrackObject;
    copyrights: Array<CopyrightObject>;
    external_ids: ExternalIdObject;
    genres: Array<string>;
    label: string;
    popularity: number;
  }>;
type PagingSimplifiedTrackObject = PagingObject &
  Partial<{
    items: Array<SimplifiedTrackObject>;
  }>;
type SimplifiedTrackObject = Partial<{
  artists: Array<SimplifiedArtistObject>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedTrackObject;
  restrictions: TrackRestrictionObject;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}>;
type LinkedTrackObject = Partial<{
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: string;
  uri: string;
}>;
type PagingSavedAlbumObject = PagingObject &
  Partial<{
    items: Array<SavedAlbumObject>;
  }>;
type SavedAlbumObject = Partial<{
  added_at: string;
  album: AlbumObject;
}>;
type PagingSimplifiedAlbumObject = PagingObject &
  Partial<{
    items: Array<SimplifiedAlbumObject>;
  }>;

const LinkedTrackObject: z.ZodType<LinkedTrackObject> = z
  .object({
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    type: z.string(),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const SimplifiedTrackObject: z.ZodType<SimplifiedTrackObject> = z
  .object({
    artists: z.array(SimplifiedArtistObject),
    available_markets: z.array(z.string()),
    disc_number: z.number().int(),
    duration_ms: z.number().int(),
    explicit: z.boolean(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    is_playable: z.boolean(),
    linked_from: LinkedTrackObject,
    restrictions: TrackRestrictionObject,
    name: z.string(),
    preview_url: z.string().nullable(),
    track_number: z.number().int(),
    type: z.string(),
    uri: z.string(),
    is_local: z.boolean(),
  })
  .partial()
  .passthrough();
const PagingSimplifiedTrackObject: z.ZodType<PagingSimplifiedTrackObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedTrackObject) })
      .partial()
      .passthrough()
  );
const AlbumObject = AlbumBase.and(
  z
    .object({
      artists: z.array(SimplifiedArtistObject),
      tracks: PagingSimplifiedTrackObject,
      copyrights: z.array(CopyrightObject),
      external_ids: ExternalIdObject,
      genres: z.array(z.string()),
      label: z.string(),
      popularity: z.number().int(),
    })
    .partial()
    .passthrough()
);
const SavedAlbumObject: z.ZodType<SavedAlbumObject> = z
  .object({
    added_at: z.string().datetime({ offset: true }),
    album: AlbumObject,
  })
  .partial()
  .passthrough();
const PagingSavedAlbumObject: z.ZodType<PagingSavedAlbumObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SavedAlbumObject) })
      .partial()
      .passthrough()
  );
const PagingSimplifiedAlbumObject: z.ZodType<PagingSimplifiedAlbumObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedAlbumObject) })
      .partial()
      .passthrough()
  );

export const schemas = {
  LinkedTrackObject,
  SimplifiedTrackObject,
  PagingSimplifiedTrackObject,
  AlbumObject,
  SavedAlbumObject,
  PagingSavedAlbumObject,
  PagingSimplifiedAlbumObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/albums/:id",
    alias: "get-an-album",
    description: `Get Spotify catalog information for a single album.
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
    response: AlbumObject,
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
    path: "/albums",
    alias: "get-multiple-albums",
    description: `Get Spotify catalog information for multiple albums identified by their Spotify IDs.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.object({ albums: z.array(AlbumObject) }).passthrough(),
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
    path: "/albums/:id/tracks",
    alias: "get-an-albums-tracks",
    description: `Get Spotify catalog information about an album’s tracks.
Optional parameters can be used to limit the number of tracks returned.
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
    response: PagingSimplifiedTrackObject,
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
    path: "/me/albums",
    alias: "get-users-saved-albums",
    description: `Get a list of the albums saved in the current Spotify user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
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
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: PagingSavedAlbumObject,
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
    method: "put",
    path: "/me/albums",
    alias: "save-albums-user",
    description: `Save one or more albums to the current user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ ids: z.array(z.string()) })
          .partial()
          .passthrough(),
      },
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.void(),
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
    method: "delete",
    path: "/me/albums",
    alias: "remove-albums-user",
    description: `Remove one or more albums from the current user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ ids: z.array(z.string()) })
          .partial()
          .passthrough(),
      },
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.void(),
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
    path: "/me/albums/contains",
    alias: "check-users-saved-albums",
    description: `Check if one or more albums is already saved in the current Spotify user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.array(z.boolean()),
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
    path: "/browse/new-releases",
    alias: "get-new-releases",
    description: `Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
`,
    requestFormat: "json",
    parameters: [
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
    response: z.object({ albums: PagingSimplifiedAlbumObject }).passthrough(),
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

export const AlbumsApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
