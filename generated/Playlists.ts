import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  EpisodeObject,
  ErrorObject,
  ExternalUrlObject,
  ImageObject,
  PagingObject,
  TrackObject,
} from "./common";

export type PlaylistObject = Partial<{
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject> | null;
  name: string;
  owner: PlaylistOwnerObject;
  public: boolean;
  snapshot_id: string;
  tracks: PagingPlaylistTrackObject;
  type: string;
  uri: string;
}>;
export type PlaylistOwnerObject = PlaylistUserObject &
  Partial<{
    display_name: string | null;
  }>;
export type PlaylistUserObject = Partial<{
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: "user";
  uri: string;
}>;
export type PagingPlaylistTrackObject = PagingObject &
  Partial<{
    items: Array<PlaylistTrackObject>;
  }>;
export type PlaylistTrackObject = Partial<{
  added_at: string;
  added_by: PlaylistUserObject;
  is_local: boolean;
  track: TrackObject | EpisodeObject;
}>;
export type PagingPlaylistObject = PagingObject &
  Partial<{
    items: Array<SimplifiedPlaylistObject>;
  }>;
export type SimplifiedPlaylistObject = Partial<{
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject> | null;
  name: string;
  owner: PlaylistOwnerObject;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracksRefObject;
  type: string;
  uri: string;
}>;
export type PlaylistTracksRefObject = Partial<{
  href: string;
  total: number;
}>;

const PlaylistUserObject: z.ZodType<PlaylistUserObject> = z
  .object({
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    type: z.literal("user"),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const PlaylistTrackObject: z.ZodType<PlaylistTrackObject> = z
  .object({
    added_at: z.string().datetime({ offset: true }),
    added_by: PlaylistUserObject,
    is_local: z.boolean(),
    track: z.union([TrackObject, EpisodeObject]),
  })
  .partial()
  .passthrough();
const PlaylistOwnerObject = PlaylistUserObject.and(
  z.object({ display_name: z.string().nullable() }).partial().passthrough()
);
const PlaylistTracksRefObject: z.ZodType<PlaylistTracksRefObject> = z
  .object({ href: z.string(), total: z.number().int() })
  .partial()
  .passthrough();
const SimplifiedPlaylistObject: z.ZodType<SimplifiedPlaylistObject> = z
  .object({
    collaborative: z.boolean(),
    description: z.string(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject).nullable(),
    name: z.string(),
    owner: PlaylistOwnerObject,
    public: z.boolean(),
    snapshot_id: z.string(),
    tracks: PlaylistTracksRefObject,
    type: z.string(),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const PagingPlaylistObject: z.ZodType<PagingPlaylistObject> = PagingObject.and(
  z
    .object({ items: z.array(SimplifiedPlaylistObject) })
    .partial()
    .passthrough()
);
const PagingPlaylistTrackObject: z.ZodType<PagingPlaylistTrackObject> =
  PagingObject.and(
    z
      .object({ items: z.array(PlaylistTrackObject) })
      .partial()
      .passthrough()
  );
const PlaylistObject: z.ZodType<PlaylistObject> = z
  .object({
    collaborative: z.boolean(),
    description: z.string().nullable(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject).nullable(),
    name: z.string(),
    owner: PlaylistOwnerObject,
    public: z.boolean(),
    snapshot_id: z.string(),
    tracks: PagingPlaylistTrackObject,
    type: z.string(),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const remove_tracks_playlist_Body = z
  .object({
    tracks: z.array(z.object({ uri: z.string() }).partial().passthrough()),
    snapshot_id: z.string().optional(),
  })
  .passthrough();

export const schemas = {
  PlaylistUserObject,
  PlaylistTrackObject,
  PlaylistOwnerObject,
  PlaylistTracksRefObject,
  SimplifiedPlaylistObject,
  PagingPlaylistObject,
  PagingPlaylistTrackObject,
  PlaylistObject,
  remove_tracks_playlist_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/playlists/:playlist_id",
    alias: "get-playlist",
    description: `Get a playlist owned by a Spotify user.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "additional_types",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: PlaylistObject,
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
    path: "/playlists/:playlist_id",
    alias: "change-playlist-details",
    description: `Change a playlist&#x27;s name and public/private state. (The user must, of
course, own the playlist.)
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            name: z.string(),
            public: z.boolean(),
            collaborative: z.boolean(),
            description: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        name: "playlist_id",
        type: "Path",
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
    path: "/playlists/:playlist_id/tracks",
    alias: "get-playlists-tracks",
    description: `Get full details of the items of a playlist owned by a Spotify user.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fields",
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
      {
        name: "additional_types",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: PagingPlaylistTrackObject,
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
    method: "post",
    path: "/playlists/:playlist_id/tracks",
    alias: "add-tracks-to-playlist",
    description: `Add one or more items to a user&#x27;s playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ uris: z.array(z.string()), position: z.number().int() })
          .partial()
          .passthrough(),
      },
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "position",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "uris",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.object({ snapshot_id: z.string() }).partial().passthrough(),
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
    path: "/playlists/:playlist_id/tracks",
    alias: "reorder-or-replace-playlists-tracks",
    description: `Either reorder or replace items in a playlist depending on the request&#x27;s parameters.
To reorder items, include &#x60;range_start&#x60;, &#x60;insert_before&#x60;, &#x60;range_length&#x60; and &#x60;snapshot_id&#x60; in the request&#x27;s body.
To replace items, include &#x60;uris&#x60; as either a query parameter or in the request&#x27;s body.
Replacing items in a playlist will overwrite its existing items. This operation can be used for replacing or clearing items in a playlist.
&lt;br/&gt;
**Note**: Replace and reorder are mutually exclusive operations which share the same endpoint, but have different parameters.
These operations can&#x27;t be applied together in a single request.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            uris: z.array(z.string()),
            range_start: z.number().int(),
            insert_before: z.number().int(),
            range_length: z.number().int(),
            snapshot_id: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "uris",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.object({ snapshot_id: z.string() }).partial().passthrough(),
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
    path: "/playlists/:playlist_id/tracks",
    alias: "remove-tracks-playlist",
    description: `Remove one or more items from a user&#x27;s playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: remove_tracks_playlist_Body,
      },
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ snapshot_id: z.string() }).partial().passthrough(),
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
    path: "/me/playlists",
    alias: "get-a-list-of-current-users-playlists",
    description: `Get a list of the playlists owned or followed by the current Spotify
user.
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
    response: PagingPlaylistObject,
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
    path: "/users/:user_id/playlists",
    alias: "get-list-users-playlists",
    description: `Get a list of the playlists owned or followed by a Spotify user.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "user_id",
        type: "Path",
        schema: z.string(),
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
    response: PagingPlaylistObject,
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
    method: "post",
    path: "/users/:user_id/playlists",
    alias: "create-playlist",
    description: `Create a playlist for a Spotify user. (The playlist will be empty until
you [add tracks](/documentation/web-api/reference/add-tracks-to-playlist).)
Each user is generally limited to a maximum of 11000 playlists.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            name: z.string(),
            public: z.boolean().optional(),
            collaborative: z.boolean().optional(),
            description: z.string().optional(),
          })
          .passthrough(),
      },
      {
        name: "user_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: PlaylistObject,
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
    path: "/playlists/:playlist_id/images",
    alias: "get-playlist-cover",
    description: `Get the current image associated with a specific playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(ImageObject),
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
    path: "/playlists/:playlist_id/images",
    alias: "upload-custom-playlist-cover",
    description: `Replace the image used to represent a specific playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "playlist_id",
        type: "Path",
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
]);

export const PlaylistsApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
