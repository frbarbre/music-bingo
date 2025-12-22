import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  EpisodeBase,
  ErrorObject,
  PagingObject,
  ShowBase,
  SimplifiedShowObject,
} from "./common";

type ShowObject = ShowBase & {
  episodes: PagingSimplifiedEpisodeObject;
};
type PagingSimplifiedEpisodeObject = PagingObject &
  Partial<{
    items: Array<SimplifiedEpisodeObject>;
  }>;
type SimplifiedEpisodeObject = EpisodeBase & {};
type PagingSavedShowObject = PagingObject &
  Partial<{
    items: Array<SavedShowObject>;
  }>;
type SavedShowObject = Partial<{
  added_at: string;
  show: SimplifiedShowObject;
}>;

const SavedShowObject: z.ZodType<SavedShowObject> = z
  .object({
    added_at: z.string().datetime({ offset: true }),
    show: SimplifiedShowObject,
  })
  .partial()
  .passthrough();
const PagingSavedShowObject: z.ZodType<PagingSavedShowObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SavedShowObject) })
      .partial()
      .passthrough()
  );
const SimplifiedEpisodeObject: z.ZodType<SimplifiedEpisodeObject> =
  EpisodeBase.and(z.object({}).partial().passthrough());
const PagingSimplifiedEpisodeObject: z.ZodType<PagingSimplifiedEpisodeObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedEpisodeObject) })
      .partial()
      .passthrough()
  );
const ShowObject: z.ZodType<ShowObject> = ShowBase.and(
  z.object({ episodes: PagingSimplifiedEpisodeObject }).passthrough()
);

export const schemas = {
  SavedShowObject,
  PagingSavedShowObject,
  SimplifiedEpisodeObject,
  PagingSimplifiedEpisodeObject,
  ShowObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/shows/:id",
    alias: "get-a-show",
    description: `Get Spotify catalog information for a single show identified by its
unique Spotify ID.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "market",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ShowObject,
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
    path: "/shows",
    alias: "get-multiple-shows",
    description: `Get Spotify catalog information for several shows based on their Spotify IDs.
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
    response: z.object({ shows: z.array(SimplifiedShowObject) }).passthrough(),
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
    path: "/shows/:id/episodes",
    alias: "get-a-shows-episodes",
    description: `Get Spotify catalog information about an show’s episodes. Optional parameters can be used to limit the number of episodes returned.
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
    response: PagingSimplifiedEpisodeObject,
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
    path: "/me/shows",
    alias: "get-users-saved-shows",
    description: `Get a list of shows saved in the current Spotify user&#x27;s library. Optional parameters can be used to limit the number of shows returned.
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
    response: PagingSavedShowObject,
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
    path: "/me/shows",
    alias: "save-shows-user",
    description: `Save one or more shows to current Spotify user&#x27;s library.
`,
    requestFormat: "json",
    parameters: [
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
    path: "/me/shows",
    alias: "remove-shows-user",
    description: `Delete one or more shows from current Spotify user&#x27;s library.
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
    path: "/me/shows/contains",
    alias: "check-users-saved-shows",
    description: `Check if one or more shows is already saved in the current Spotify user&#x27;s library.
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

export const ShowsApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
