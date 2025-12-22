import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  EpisodeObject,
  ErrorObject,
  ExternalUrlObject,
  TrackObject,
} from "./common";

type CurrentlyPlayingContextObject = Partial<{
  device: DeviceObject;
  repeat_state: string;
  shuffle_state: boolean;
  context: ContextObject;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: TrackObject | EpisodeObject;
  currently_playing_type: string;
  actions: DisallowsObject;
}>;
type DeviceObject = Partial<{
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
  supports_volume: boolean;
}>;
type ContextObject = Partial<{
  type: string;
  href: string;
  external_urls: ExternalUrlObject;
  uri: string;
}>;
type DisallowsObject = Partial<{
  interrupting_playback: boolean;
  pausing: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_shuffle: boolean;
  toggling_repeat_track: boolean;
  transferring_playback: boolean;
}>;
type CursorPagingPlayHistoryObject = CursorPagingObject &
  Partial<{
    items: Array<PlayHistoryObject>;
  }>;
type CursorPagingObject = Partial<{
  href: string;
  limit: number;
  next: string;
  cursors: CursorObject;
  total: number;
}>;
type CursorObject = Partial<{
  after: string;
  before: string;
}>;
type PlayHistoryObject = Partial<{
  track: TrackObject;
  played_at: string;
  context: ContextObject;
}>;
type QueueObject = Partial<{
  currently_playing: TrackObject | EpisodeObject;
  queue: Array<TrackObject | EpisodeObject>;
}>;

const ContextObject: z.ZodType<ContextObject> = z
  .object({
    type: z.string(),
    href: z.string(),
    external_urls: ExternalUrlObject,
    uri: z.string(),
  })
  .partial()
  .passthrough();
const PlayHistoryObject: z.ZodType<PlayHistoryObject> = z
  .object({
    track: TrackObject,
    played_at: z.string().datetime({ offset: true }),
    context: ContextObject,
  })
  .partial()
  .passthrough();
const QueueObject: z.ZodType<QueueObject> = z
  .object({
    currently_playing: z.union([TrackObject, EpisodeObject]),
    queue: z.array(z.union([TrackObject, EpisodeObject])),
  })
  .partial()
  .passthrough();
const DeviceObject: z.ZodType<DeviceObject> = z
  .object({
    id: z.string().nullable(),
    is_active: z.boolean(),
    is_private_session: z.boolean(),
    is_restricted: z.boolean(),
    name: z.string(),
    type: z.string(),
    volume_percent: z.number().int().gte(0).lte(100).nullable(),
    supports_volume: z.boolean(),
  })
  .partial()
  .passthrough();
const DisallowsObject: z.ZodType<DisallowsObject> = z
  .object({
    interrupting_playback: z.boolean(),
    pausing: z.boolean(),
    resuming: z.boolean(),
    seeking: z.boolean(),
    skipping_next: z.boolean(),
    skipping_prev: z.boolean(),
    toggling_repeat_context: z.boolean(),
    toggling_shuffle: z.boolean(),
    toggling_repeat_track: z.boolean(),
    transferring_playback: z.boolean(),
  })
  .partial()
  .passthrough();
const CurrentlyPlayingContextObject: z.ZodType<CurrentlyPlayingContextObject> =
  z
    .object({
      device: DeviceObject,
      repeat_state: z.string(),
      shuffle_state: z.boolean(),
      context: ContextObject,
      timestamp: z.number().int(),
      progress_ms: z.number().int(),
      is_playing: z.boolean(),
      item: z.union([TrackObject, EpisodeObject]),
      currently_playing_type: z.string(),
      actions: DisallowsObject,
    })
    .partial()
    .passthrough();
const CursorObject: z.ZodType<CursorObject> = z
  .object({ after: z.string(), before: z.string() })
  .partial()
  .passthrough();
const CursorPagingObject: z.ZodType<CursorPagingObject> = z
  .object({
    href: z.string(),
    limit: z.number().int(),
    next: z.string(),
    cursors: CursorObject,
    total: z.number().int(),
  })
  .partial()
  .passthrough();
const CursorPagingPlayHistoryObject: z.ZodType<CursorPagingPlayHistoryObject> =
  CursorPagingObject.and(
    z
      .object({ items: z.array(PlayHistoryObject) })
      .partial()
      .passthrough()
  );

export const schemas = {
  ContextObject,
  PlayHistoryObject,
  QueueObject,
  DeviceObject,
  DisallowsObject,
  CurrentlyPlayingContextObject,
  CursorObject,
  CursorPagingObject,
  CursorPagingPlayHistoryObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/me/player",
    alias: "get-information-about-the-users-current-playback",
    description: `Get information about the user’s current playback state, including track or episode, progress, and active device.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "additional_types",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: CurrentlyPlayingContextObject,
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
    path: "/me/player",
    alias: "transfer-a-users-playback",
    description: `Transfer playback to a new device and optionally begin playback. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            device_ids: z.array(z.string()),
            play: z.boolean().optional(),
          })
          .passthrough(),
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
    path: "/me/player/devices",
    alias: "get-a-users-available-devices",
    description: `Get information about a user’s available Spotify Connect devices. Some device models are not supported and will not be listed in the API response.
`,
    requestFormat: "json",
    response: z.object({ devices: z.array(DeviceObject) }).passthrough(),
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
    path: "/me/player/currently-playing",
    alias: "get-the-users-currently-playing-track",
    description: `Get the object currently being played on the user&#x27;s Spotify account.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "additional_types",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: CurrentlyPlayingContextObject,
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
    path: "/me/player/play",
    alias: "start-a-users-playback",
    description: `Start a new context or resume current playback on the user&#x27;s active device. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            context_uri: z.string(),
            uris: z.array(z.string()),
            offset: z.object({}).partial().passthrough(),
            position_ms: z.number().int(),
          })
          .partial()
          .passthrough(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "put",
    path: "/me/player/pause",
    alias: "pause-a-users-playback",
    description: `Pause playback on the user&#x27;s account. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "post",
    path: "/me/player/next",
    alias: "skip-users-playback-to-next-track",
    description: `Skips to next track in the user’s queue. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "post",
    path: "/me/player/previous",
    alias: "skip-users-playback-to-previous-track",
    description: `Skips to previous track in the user’s queue. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "put",
    path: "/me/player/seek",
    alias: "seek-to-position-in-currently-playing-track",
    description: `Seeks to the given position in the user’s currently playing track. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "position_ms",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "put",
    path: "/me/player/repeat",
    alias: "set-repeat-mode-on-users-playback",
    description: `Set the repeat mode for the user&#x27;s playback. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "state",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "put",
    path: "/me/player/volume",
    alias: "set-volume-for-users-playback",
    description: `Set the volume for the user’s current playback device. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "volume_percent",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    method: "put",
    path: "/me/player/shuffle",
    alias: "toggle-shuffle-for-users-playback",
    description: `Toggle shuffle on or off for user’s playback. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "state",
        type: "Query",
        schema: z.boolean(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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
    path: "/me/player/recently-played",
    alias: "get-recently-played",
    description: `Get tracks from the current user&#x27;s recently played tracks.
_**Note**: Currently doesn&#x27;t support podcast episodes._
`,
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(0).lte(50).optional().default(20),
      },
      {
        name: "after",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "before",
        type: "Query",
        schema: z.number().int().optional(),
      },
    ],
    response: CursorPagingPlayHistoryObject,
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
    path: "/me/player/queue",
    alias: "get-queue",
    description: `Get the list of objects that make up the user&#x27;s queue.
`,
    requestFormat: "json",
    response: QueueObject,
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
    path: "/me/player/queue",
    alias: "add-to-queue",
    description: `Add an item to be played next in the user&#x27;s current playback queue. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "uri",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "device_id",
        type: "Query",
        schema: z.string().optional(),
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

export const PlayerApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
