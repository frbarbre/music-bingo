import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import {
  AudiobookBase,
  ChapterBase,
  ErrorObject,
  PagingObject,
  SimplifiedAudiobookObject,
} from "./common";

type AudiobookObject = AudiobookBase & {
  chapters: PagingSimplifiedChapterObject;
};
type PagingSimplifiedChapterObject = PagingObject &
  Partial<{
    items: Array<SimplifiedChapterObject>;
  }>;
type SimplifiedChapterObject = ChapterBase & {};
type PagingSimplifiedAudiobookObject = PagingObject &
  Partial<{
    items: Array<SimplifiedAudiobookObject>;
  }>;

const PagingSimplifiedAudiobookObject: z.ZodType<PagingSimplifiedAudiobookObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedAudiobookObject) })
      .partial()
      .passthrough()
  );
const SimplifiedChapterObject: z.ZodType<SimplifiedChapterObject> =
  ChapterBase.and(z.object({}).partial().passthrough());
const PagingSimplifiedChapterObject: z.ZodType<PagingSimplifiedChapterObject> =
  PagingObject.and(
    z
      .object({ items: z.array(SimplifiedChapterObject) })
      .partial()
      .passthrough()
  );
const AudiobookObject: z.ZodType<AudiobookObject> = AudiobookBase.and(
  z.object({ chapters: PagingSimplifiedChapterObject }).passthrough()
);

export const schemas = {
  PagingSimplifiedAudiobookObject,
  SimplifiedChapterObject,
  PagingSimplifiedChapterObject,
  AudiobookObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/audiobooks/:id",
    alias: "get-an-audiobook",
    description: `Get Spotify catalog information for a single audiobook. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
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
    response: AudiobookObject,
    errors: [
      {
        status: 400,
        description: `The request contains malformed data in path, query parameters, or body.
`,
        schema: z.object({ error: ErrorObject }).passthrough(),
      },
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
        status: 404,
        description: `The requested resource cannot be found.
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
    path: "/audiobooks",
    alias: "get-multiple-audiobooks",
    description: `Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
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
    response: z.object({ audiobooks: z.array(AudiobookObject) }).passthrough(),
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
    path: "/audiobooks/:id/chapters",
    alias: "get-audiobook-chapters",
    description: `Get Spotify catalog information about an audiobook&#x27;s chapters. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
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
    response: PagingSimplifiedChapterObject,
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
    path: "/me/audiobooks",
    alias: "get-users-saved-audiobooks",
    description: `Get a list of the audiobooks saved in the current Spotify user&#x27;s &#x27;Your Music&#x27; library.
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
    response: PagingSimplifiedAudiobookObject,
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
    path: "/me/audiobooks",
    alias: "save-audiobooks-user",
    description: `Save one or more audiobooks to the current Spotify user&#x27;s library.
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
    path: "/me/audiobooks",
    alias: "remove-audiobooks-user",
    description: `Remove one or more audiobooks from the Spotify user&#x27;s library.
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
    method: "get",
    path: "/me/audiobooks/contains",
    alias: "check-users-saved-audiobooks",
    description: `Check if one or more audiobooks are already saved in the current Spotify user&#x27;s library.
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

export const AudiobooksApi = new Zodios(
  "https://api.spotify.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
