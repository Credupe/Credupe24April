/**
 * Tiny zero-dep CSV parser tuned for the lead-import flow.
 *
 * - Expects a header row.
 * - Recognised header aliases (case- + space-insensitive):
 *     customerName | name | customer
 *     customerMobile | mobile | phone
 *     customerEmail | email
 *     loanType | type | product
 *     amount | loan_amount
 *     city
 *     notes | note | remark
 * - Handles quoted fields with commas inside (`"Mehta, Mahesh"`) and escaped quotes (`""`).
 * - Returns `{ valid, invalid }` so the UI can highlight bad rows without dropping them silently.
 */

import type { BulkLeadItem } from "../api/credupe";

const LOAN_TYPES = ["PERSONAL_LOAN", "HOME_LOAN", "BUSINESS_LOAN", "CAR_LOAN", "GOLD_LOAN"];

const HEADER_ALIASES: Record<string, keyof BulkLeadItem> = {
  customername: "customerName",
  name: "customerName",
  customer: "customerName",
  customermobile: "customerMobile",
  mobile: "customerMobile",
  phone: "customerMobile",
  customeremail: "customerEmail",
  email: "customerEmail",
  loantype: "loanType",
  type: "loanType",
  product: "loanType",
  amount: "amount",
  loan_amount: "amount",
  loanamount: "amount",
  city: "city",
  notes: "notes",
  note: "notes",
  remark: "notes",
};

export interface ParsedCsv {
  valid: BulkLeadItem[];
  invalid: { row: number; reason: string; raw: string }[];
  headerMapping: Record<string, keyof BulkLeadItem | undefined>;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuote = false;
      else cur += ch;
    } else {
      if (ch === ',') { cells.push(cur); cur = ""; }
      else if (ch === '"' && cur === "") inQuote = true;
      else cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function normaliseLoanType(s: string): string {
  const v = s.trim().toUpperCase().replace(/\s+/g, "_");
  if (LOAN_TYPES.includes(v)) return v;
  // Friendly aliases
  if (v === "PERSONAL" || v === "PL") return "PERSONAL_LOAN";
  if (v === "HOME" || v === "HL" || v === "MORTGAGE") return "HOME_LOAN";
  if (v === "BUSINESS" || v === "BIZ" || v === "BL") return "BUSINESS_LOAN";
  if (v === "CAR" || v === "AUTO" || v === "VEHICLE") return "CAR_LOAN";
  if (v === "GOLD") return "GOLD_LOAN";
  return v; // backend will reject if invalid
}

export function parseLeadsCsv(text: string): ParsedCsv {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { valid: [], invalid: [{ row: 0, reason: "CSV must have header + at least 1 row", raw: text.slice(0, 80) }], headerMapping: {} };
  }
  const headerCells = splitCsvLine(lines[0]);
  const headerMapping: Record<string, keyof BulkLeadItem | undefined> = {};
  const colToField: (keyof BulkLeadItem | undefined)[] = headerCells.map((h) => {
    const key = h.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const field = HEADER_ALIASES[key];
    headerMapping[h] = field;
    return field;
  });

  if (!colToField.includes("customerName") || !colToField.includes("customerMobile") || !colToField.includes("loanType")) {
    return {
      valid: [],
      invalid: [{ row: 0, reason: "Missing required columns: customerName, customerMobile, loanType", raw: lines[0] }],
      headerMapping,
    };
  }

  const valid: BulkLeadItem[] = [];
  const invalid: ParsedCsv["invalid"] = [];

  for (let r = 1; r < lines.length; r++) {
    const cells = splitCsvLine(lines[r]);
    const row: Partial<BulkLeadItem> = {};
    cells.forEach((cell, i) => {
      const field = colToField[i];
      if (!field) return;
      if (field === "amount") {
        const n = Number(cell.replace(/[^0-9.]/g, ""));
        if (n > 0) row.amount = n;
      } else if (field === "loanType") {
        row.loanType = normaliseLoanType(cell);
      } else {
        (row as any)[field] = cell;
      }
    });
    if (!row.customerName || !row.customerMobile || !row.loanType) {
      invalid.push({ row: r + 1, reason: "Missing customerName, customerMobile or loanType", raw: lines[r] });
      continue;
    }
    if (!LOAN_TYPES.includes(row.loanType)) {
      invalid.push({ row: r + 1, reason: `Unknown loanType "${row.loanType}"`, raw: lines[r] });
      continue;
    }
    const cleanMobile = row.customerMobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      invalid.push({ row: r + 1, reason: `Mobile must be 10 digits, got "${row.customerMobile}"`, raw: lines[r] });
      continue;
    }
    row.customerMobile = cleanMobile;
    valid.push(row as BulkLeadItem);
  }

  return { valid, invalid, headerMapping };
}

export const SAMPLE_CSV = `customerName,customerMobile,loanType,amount,city,notes
Rohan Mehta,9810030001,PERSONAL_LOAN,500000,Mumbai,Walk-in enquiry
Priya Kapoor,9810030002,HOME_LOAN,7500000,Pune,Pre-approved
Amit Sharma,9810030003,BUSINESS_LOAN,2000000,Delhi,Existing customer`;
