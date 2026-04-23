/**
 * Small ID + hashing helpers. No external crypto deps — uses the Web Crypto
 * API available in Workers.
 */
export function newId(prefix = "id"): string {
  // Readable, url-safe, 16 random bytes of base36.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const s = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("");
  return `${prefix}_${s.slice(0, 22)}`;
}

export function newReferenceNo(prefix = "CRD"): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  const year = new Date().getUTCFullYear();
  return `${prefix}-${year}-${hex}`;
}

export function newSlug(bytes = 8): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(36)).join("").slice(0, 12);
}

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
