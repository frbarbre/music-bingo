import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { ErrorObject, PagingObject, TrackObject } from "./common";

type PagingSavedTrackObject = PagingObject &
  Partial<{
    items: Array<SavedTrackObject>;
  }>;
type SavedTrackObject = Partial<{
  added_at: string;
  track: TrackObject;
}>;

const SavedTrackObject: z.ZodType<SavedTrackObject> = z
  .object({
    added_at: z.string().datetime({ offset: true }),
    track: TrackObject,
  })
  .partial()
  .passthrough();
const PagingSavedTrackObject: z.ZodType<PagingSavedTrackObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SavedTrackObject) })
      .partial()
      .passthrough()
  );

export const schemas = {
  SavedTrackObject,
  PagingSavedTrackObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/tracks/:id",
    alias: "get-track",
    description: `Get Spotify catalog information for a single track identified by its
unique Spotify ID.
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
    response: TrackObject,
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
    path: "/tracks",
    alias: "get-several-tracks",
    description: `Get Spotify catalog information for multiple tracks based on their Spotify IDs.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "ids",
        type: "Query",
        schema: z.string(),
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
  {
    method: "get",
    path: "/me/tracks",
    alias: "get-users-saved-tracks",
    description: `Get a list of the songs saved in the current Spotify user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
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
    response: PagingSavedTrackObject,
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
    path: "/me/tracks",
    alias: "save-tracks-user",
    description: `Save one or more tracks to the current user&#x27;s &#x27;Your Music&#x27; library.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({
            ids: z.array(z.string()).optional(),
            timestamped_ids: z
              .array(
                z
                  .object({
                    id: z.string(),
                    added_at: z.string().datetime({ offset: true }),
                  })
                  .passthrough()
              )
              .optional(),
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
    method: "delete",
    path: "/me/tracks",
    alias: "remove-tracks-user",
    description: `Remove one or more tracks from the current user&#x27;s &#x27;Your Music&#x27; library.
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
    path: "/me/tracks/contains",
    alias: "check-users-saved-tracks",
    description: `Check if one or more tracks is already saved in the current Spotify user&#x27;s &#x27;Your Music&#x27; library.
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
]);

export const TracksApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
