import { NextIntegrate } from "next-integrate";
import { login } from "@/lib";

export const { auth } = NextIntegrate({
  // The URL of the app, e.g. https://example.com, set in the .env file.
  // If you want to modify the redirect URL, to be prefixed with something else,
  // you can do it here like this:
  // base_url: process.env.BASE_URL! + "/some-prefix",
  // This will change the redirect URL to eg. https://example.com/some-prefix/api/auth/integration/google
  base_url: process.env.BASE_URL!,
  providers: [
    {
      provider: "spotify",
      client_id: process.env.AUTH_SPOTIFY_ID!,
      client_secret: process.env.AUTH_SPOTIFY_SECRET!,
      integrations: [
        {
          name: "login",
          options: {
            scope: "playlist-read-private",
            show_dialog: true,
          },
          callback: async (data) => {
            await login(data.refresh_token);
          },
        },
      ],
    },
  ],
});
