import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { ErrorObject } from "./common";

const endpoints = makeApi([
  {
    method: "get",
    path: "/markets",
    alias: "get-available-markets",
    description: `Get the list of markets where Spotify is available.
`,
    requestFormat: "json",
    response: z
      .object({ markets: z.array(z.string()) })
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

export const MarketsApi = new Zodios("https://api.spotify.com/v1", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
