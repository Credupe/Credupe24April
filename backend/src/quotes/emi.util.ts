/**
 * Standard EMI formula:
 *   EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 * P = principal, r = monthly rate (annual% / 12 / 100), n = tenure in months.
 * Returns a Number rounded to two decimal places.
 */
export function monthlyEmi(principal: number, annualRatePct: number, tenureMonths: number): number {
  const P = Number(principal);
  const r = Number(annualRatePct) / 12 / 100;
  const n = Math.max(1, Math.floor(tenureMonths));
  if (r === 0) return Math.round((P / n) * 100) / 100;
  const pow = Math.pow(1 + r, n);
  const emi = (P * r * pow) / (pow - 1);
  return Math.round(emi * 100) / 100;
}

export function totalInterest(principal: number, emi: number, tenureMonths: number): number {
  const totalPaid = emi * tenureMonths;
  return Math.round((totalPaid - principal) * 100) / 100;
}
