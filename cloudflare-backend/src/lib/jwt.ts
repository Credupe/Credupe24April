/**
 * Minimal HMAC-SHA256 JWT signer/verifier — no external deps, runs on Workers.
 * We don't need full JOSE since both tokens are HMAC-signed and issued by us.
 */

type Base64Url = string;

function b64urlEncode(bytes: Uint8Array): Base64Url {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlDecode(s: Base64Url): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

export type JwtClaims = {
  sub: string;
  email: string;
  role: "CUSTOMER" | "PARTNER" | "ADMIN";
  iat: number;
  exp: number;
  typ: "access" | "refresh";
};

export async function signJwt(
  claims: Omit<JwtClaims, "iat" | "exp">,
  secret: string,
  ttlSeconds: number,
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const payload: JwtClaims = { ...claims, iat, exp: iat + ttlSeconds };
  const header = { alg: "HS256", typ: "JWT" };
  const h = b64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const p = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(secret, `${h}.${p}`);
  return `${h}.${p}.${b64urlEncode(sig)}`;
}

export async function verifyJwt(
  token: string,
  secret: string,
): Promise<JwtClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = await hmac(secret, `${h}.${p}`);
  const given = b64urlDecode(s);
  if (expected.length !== given.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ given[i];
  if (diff !== 0) return null;
  try {
    const claims = JSON.parse(new TextDecoder().decode(b64urlDecode(p))) as JwtClaims;
    if (claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}
