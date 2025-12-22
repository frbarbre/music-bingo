import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Session } from "./types";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { [key: string]: unknown }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 years from now")
    .sign(key);
}

export async function decrypt(
  input: string
): Promise<{ [key: string]: unknown }> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(refreshToken: string) {
  // Create the session
  const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 years in milliseconds
  const session = await encrypt({ refreshToken, expires });

  // Save the session in a cookie
  (await cookies()).set("store", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("store", "", { expires: new Date(0) });
}

export async function getSession(): Promise<Session | null> {
  const session = (await cookies()).get("store")?.value;
  if (!session) return null;
  return (await decrypt(session)) as Session;
}
