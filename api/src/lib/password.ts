// bcryptjs works in Workers (slow-ish ~50ms for salt 10, acceptable for auth).
import bcrypt from "bcryptjs";

export async function hashPassword(plain: string, rounds = 10): Promise<string> {
  return bcrypt.hash(plain, rounds);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  try { return await bcrypt.compare(plain, hashed); }
  catch { return false; }
}
