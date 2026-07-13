/**
 * Format an INR amount as a short, readable string.
 *   1234       → ₹1,234
 *   123456     → ₹1.23 L
 *   12345678   → ₹1.23 Cr
 */
export function inr(value: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value)) return "—";
  const v = Math.abs(value);
  if (opts.compact === false) {
    return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }
  if (v >= 1_00_00_000) return "₹" + (value / 1_00_00_000).toFixed(2) + " Cr";
  if (v >= 1_00_000) return "₹" + (value / 1_00_000).toFixed(2) + " L";
  if (v >= 1_000) return "₹" + (value / 1_000).toFixed(1) + " K";
  return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function pct(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(digits) + "%";
}
