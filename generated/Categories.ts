import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { ErrorObject, ImageObject, PagingObject } from "./common";

type CategoryObject = {
  href: string;
  icons: Array<ImageObject>;
  id: string;
  name: string;
};

const CategoryObject: z.ZodType<CategoryObject> = z
  .object({
    href: z.string(),
    icons: z.array(ImageObject),
    id: z.string(),
    name: z.string(),
  })
  .passthrough();

export const schemas = {
  CategoryObject,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/browse/categories",
    alias: "get-categories",
    description: `Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
`,
    requestFormat: "json",
    parameters: [
      {
        name: "locale",
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
    response: z
      .object({
        categories: PagingObject.and(
          z
            .object({ items: z.array(CategoryObject) })
            .partial()
            .passthrough()
        ),
      })
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
    method: "get",
    path: "/browse/categories/:category_id",
    alias: "get-a-category",
    description: `Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
`,
    requestFormat: "json",
    parameters: [
      {
        name: "category_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "locale",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: CategoryObject,
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

export const CategoriesApi = new Zodios(
  "https://api.spotify.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
