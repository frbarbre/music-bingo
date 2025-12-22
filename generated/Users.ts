import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { schemas as ArtistsSchemas } from "./Artists";
import {
  ErrorObject,
  ExternalUrlObject,
  FollowersObject,
  ImageObject,
  PagingObject,
  SimplifiedArtistObject,
  TrackObject,
} from "./common";

type PrivateUserObject = Partial<{
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContentSettingsObject;
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  product: string;
  type: string;
  uri: string;
}>;
type ExplicitContentSettingsObject = Partial<{
  filter_enabled: boolean;
  filter_locked: boolean;
}>;
type PublicUserObject = Partial<{
  display_name: string | null;
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  type: "user";
  uri: string;
}>;
type CursorPagingSimplifiedArtistObject = Partial<{
  href: string;
  limit: number;
  next: string;
  cursors: Partial<{
    after: string;
    before: string;
  }>;
  total: number;
  items: Array<SimplifiedArtistObject>;
}>;

const ExplicitContentSettingsObject: z.ZodType<ExplicitContentSettingsObject> =
  z
    .object({ filter_enabled: z.boolean(), filter_locked: z.boolean() })
    .partial()
    .passthrough();
const PrivateUserObject: z.ZodType<PrivateUserObject> = z
  .object({
    country: z.string(),
    display_name: z.string(),
    email: z.string(),
    explicit_content: ExplicitContentSettingsObject,
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    product: z.string(),
    type: z.string(),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const PublicUserObject: z.ZodType<PublicUserObject> = z
  .object({
    display_name: z.string().nullable(),
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    type: z.literal("user"),
    uri: z.string(),
  })
  .partial()
  .passthrough();
const CursorPagingSimplifiedArtistObject: z.ZodType<CursorPagingSimplifiedArtistObject> =
  z
    .object({
      href: z.string(),
      limit: z.number().int(),
      next: z.string(),
      cursors: z
        .object({
          after: z.string(),
          before: z.string(),
        })
        .partial()
        .passthrough(),
      total: z.number().int(),
      items: z.array(SimplifiedArtistObject),
    })
    .partial()
    .passthrough();

export const schemas = {
  ExplicitContentSettingsObject,
  PrivateUserObject,
  PublicUserObject,
  CursorPagingSimplifiedArtistObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/me",
    alias: "get-current-users-profile",
    description: `Get detailed profile information about the current user (including the
current user&#x27;s username).
`,
    requestFormat: "json",
    response: PrivateUserObject,
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
    path: "/me/top/:type",
    alias: "get-users-top-artists-and-tracks",
    description: `Get the current user&#x27;s top artists or tracks based on calculated affinity.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Path",
        schema: z.enum(["artists", "tracks"]),
      },
      {
        name: "time_range",
        type: "Query",
        schema: z.string().optional().default("medium_term"),
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
    response: PagingObject.and(
      z
        .object({
          items: z.array(z.union([ArtistsSchemas.ArtistObject, TrackObject])),
        })
        .partial()
        .passthrough()
    ),
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
    path: "/users/:user_id",
    alias: "get-users-profile",
    description: `Get public profile information about a Spotify user.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "user_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: PublicUserObject,
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
    path: "/playlists/:playlist_id/followers",
    alias: "follow-playlist",
    description: `Add the current user as a follower of a playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ public: z.boolean() }).partial().passthrough(),
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
    method: "delete",
    path: "/playlists/:playlist_id/followers",
    alias: "unfollow-playlist",
    description: `Remove the current user as a follower of a playlist.
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
  {
    method: "get",
    path: "/me/following",
    alias: "get-followed",
    description: `Get the current user&#x27;s followed artists.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: z.literal("artist"),
      },
      {
        name: "after",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(0).lte(50).optional().default(20),
      },
    ],
    response: z
      .object({ artists: CursorPagingSimplifiedArtistObject })
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
  {
    method: "put",
    path: "/me/following",
    alias: "follow-artists-users",
    description: `Add the current user as a follower of one or more artists or other Spotify users.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ids: z.array(z.string()) }).passthrough(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.enum(["artist", "user"]),
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
    path: "/me/following",
    alias: "unfollow-artists-users",
    description: `Remove the current user as a follower of one or more artists or other Spotify users.
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
        name: "type",
        type: "Query",
        schema: z.enum(["artist", "user"]),
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
    path: "/me/following/contains",
    alias: "check-current-user-follows",
    description: `Check to see if the current user is following one or more artists or other Spotify users.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: z.enum(["artist", "user"]),
      },
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
    path: "/playlists/:playlist_id/followers/contains",
    alias: "check-if-user-follows-playlist",
    description: `Check to see if the current user is following a specified playlist.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "playlist_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "ids",
        type: "Query",
        schema: z.string().optional(),
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
]);

export const UsersApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
