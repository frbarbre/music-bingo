import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { EpisodeObject, ErrorObject, PagingObject } from "./common";

type PagingSavedEpisodeObject = PagingObject &
  Partial<{
    items: Array<SavedEpisodeObject>;
  }>;
type SavedEpisodeObject = Partial<{
  added_at: string;
  episode: EpisodeObject;
}>;

const SavedEpisodeObject: z.ZodType<SavedEpisodeObject> = z
  .object({
    added_at: z.string().datetime({ offset: true }),
    episode: EpisodeObject,
  })
  .partial()
  .passthrough();
const PagingSavedEpisodeObject: z.ZodType<PagingSavedEpisodeObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SavedEpisodeObject) })
      .partial()
      .passthrough()
  );

export const schemas = {
  SavedEpisodeObject,
  PagingSavedEpisodeObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/episodes/:id",
    alias: "get-an-episode",
    description: `Get Spotify catalog information for a single episode identified by its
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
    response: EpisodeObject,
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
    path: "/episodes",
    alias: "get-multiple-episodes",
    description: `Get Spotify catalog information for several episodes based on their Spotify IDs.
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
    response: z.object({ episodes: z.array(EpisodeObject) }).passthrough(),
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
    path: "/me/episodes",
    alias: "get-users-saved-episodes",
    description: `Get a list of the episodes saved in the current Spotify user&#x27;s library.&lt;br/&gt;
This API endpoint is in __beta__ and could change without warning. Please share any feedback that you have, or issues that you discover, in our [developer community forum](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer).
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
    response: PagingSavedEpisodeObject,
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
    path: "/me/episodes",
    alias: "save-episodes-user",
    description: `Save one or more episodes to the current user&#x27;s library.&lt;br/&gt;
This API endpoint is in __beta__ and could change without warning. Please share any feedback that you have, or issues that you discover, in our [developer community forum](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer).
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ids: z.array(z.string()).optional() }).passthrough(),
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
    path: "/me/episodes",
    alias: "remove-episodes-user",
    description: `Remove one or more episodes from the current user&#x27;s library.&lt;br/&gt;
This API endpoint is in __beta__ and could change without warning. Please share any feedback that you have, or issues that you discover, in our [developer community forum](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer).
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
    path: "/me/episodes/contains",
    alias: "check-users-saved-episodes",
    description: `Check if one or more episodes is already saved in the current Spotify user&#x27;s &#x27;Your Episodes&#x27; library.&lt;br/&gt;
This API endpoint is in __beta__ and could change without warning. Please share any feedback that you have, or issues that you discover, in our [developer community forum](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer)..
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

export const EpisodesApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
