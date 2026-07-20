import { drizzle } from "drizzle-orm/d1";
import { eq, or, isNull, lt, inArray } from "drizzle-orm";
import * as XLSX from "xlsx";
import { leads, partnerProfiles, users, systemStates } from "../db/schema";

/**
 * Generates an Excel workbook from the leads data with formatted columns.
 */
export function generateLeadsExcel(leadsData: any[]): ArrayBuffer {
  const headers = [
    "Lead ID",
    "Customer Name",
    "Customer Mobile",
    "Customer Email",
    "Loan Type",
    "Amount (INR)",
    "City",
    "Status",
    "Notes",
    "Partner Code",
    "Partner Business Name",
    "Created By Email",
    "Created At",
    "Updated At"
  ];

  const rows = leadsData.map(l => [
    l.id,
    l.customerName,
    l.customerMobile,
    l.customerEmail || "",
    l.loanType ? l.loanType.replace(/_/g, " ") : "",
    l.amountRequestedPaise ? l.amountRequestedPaise / 100 : "",
    l.city || "",
    l.status || "",
    l.notes || "",
    l.partnerCode || "",
    l.partnerBusinessName || "",
    l.createdByEmail || "",
    l.createdAt || "",
    l.updatedAt || ""
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths for readability
  ws["!cols"] = [
    { wch: 15 }, // Lead ID
    { wch: 20 }, // Customer Name
    { wch: 15 }, // Customer Mobile
    { wch: 25 }, // Customer Email
    { wch: 20 }, // Loan Type
    { wch: 15 }, // Amount
    { wch: 15 }, // City
    { wch: 15 }, // Status
    { wch: 30 }, // Notes
    { wch: 15 }, // Partner Code
    { wch: 25 }, // Partner Business Name
    { wch: 25 }, // Created By Email
    { wch: 25 }, // Created At
    { wch: 25 }  // Updated At
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Loan Leads");

  // Write sheet as array buffer
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

/**
 * Upserts the processed date to system_states to track execution.
 */
async function markDateProcessed(db: any, dateStr: string) {
  await db
    .insert(systemStates)
    .values({
      key: "leads_report_last_processed_date",
      value: dateStr,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: systemStates.key,
      set: {
        value: dateStr,
        updatedAt: new Date().toISOString(),
      },
    });
}

/**
 * Core handler executed by Wrangler Scheduled Event (cron).
 */
export async function processScheduledReport(env: any): Promise<void> {
  const db = drizzle(env.DB);
  const now = new Date();

  let currentDateStr = "";
  let currentHour = 0;
  let currentMin = 0;

  // Determine current local time in target timezone
  try {
    const tz = env.DAILY_LEADS_REPORT_TIMEZONE || "Asia/Kolkata";
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = formatter.formatToParts(now);
    const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
    currentDateStr = `${partMap.year}-${partMap.month}-${partMap.day}`;
    currentHour = parseInt(partMap.hour, 10);
    currentMin = parseInt(partMap.minute, 10);
  } catch (err) {
    console.error(`[leads-report] Error formatting timezone ${env.DAILY_LEADS_REPORT_TIMEZONE || "Asia/Kolkata"}, falling back to UTC:`, err);
    currentDateStr = now.toISOString().split("T")[0];
    currentHour = now.getUTCHours();
    currentMin = now.getUTCMinutes();
  }

  // Parse configured report time
  const reportTimeStr = env.DAILY_LEADS_REPORT_TIME || "12:00";
  const [reportHour, reportMin] = reportTimeStr.split(":").map(Number);

  const currentMinutes = currentHour * 60 + currentMin;
  const reportMinutes = reportHour * 60 + reportMin;

  console.log(`[leads-report] Scheduled run check at ${currentDateStr} ${currentHour}:${currentMin}. Target is ${reportTimeStr}.`);

  // 1. Time Check: Only execute if we have reached the scheduled time
  if (currentMinutes < reportMinutes) {
    console.log(`[leads-report] Time not reached yet. Skipping execution.`);
    return;
  }

  // 2. Date Check: Fetch last processed date to ensure only one run per day
  let lastProcessedDate = "";
  try {
    const stateRow = await db
      .select()
      .from(systemStates)
      .where(eq(systemStates.key, "leads_report_last_processed_date"))
      .limit(1);
    lastProcessedDate = stateRow[0]?.value || "";
  } catch (err) {
    console.error("[leads-report] Failed to query system_states:", err);
    // Continue anyway to ensure we don't lose data, but wrap operations safely
  }

  if (lastProcessedDate === currentDateStr) {
    console.log(`[leads-report] Report for date ${currentDateStr} has already been processed today. Skipping.`);
    return;
  }

  console.log(`[leads-report] Processing daily leads report for ${currentDateStr}...`);

  // 3. Fetch all leads joined with partner and creator details
  let allLeads: any[] = [];
  try {
    allLeads = await db.select({
      id: leads.id,
      customerName: leads.customerName,
      customerMobile: leads.customerMobile,
      customerEmail: leads.customerEmail,
      loanType: leads.loanType,
      amountRequestedPaise: leads.amountRequestedPaise,
      city: leads.city,
      status: leads.status,
      notes: leads.notes,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      reportedAt: leads.reportedAt,
      partnerCode: partnerProfiles.partnerCode,
      partnerBusinessName: partnerProfiles.businessName,
      createdByEmail: users.email,
    })
    .from(leads)
    .leftJoin(partnerProfiles, eq(leads.partnerId, partnerProfiles.id))
    .leftJoin(users, eq(leads.createdById, users.id));
  } catch (err) {
    console.error("[leads-report] Error querying leads database:", err);
    return; // Stop execution on DB failure so we can retry on next schedule
  }

  // 4. Determine if there are new/updated leads since their last report
  const dirtyLeads = allLeads.filter(lead => {
    if (!lead.reportedAt) return true;
    const reportedTime = new Date(lead.reportedAt).getTime();
    const updatedTime = new Date(lead.updatedAt).getTime();
    return reportedTime < updatedTime;
  });

  if (dirtyLeads.length === 0) {
    console.log(`[leads-report] No new or updated leads since the last report. Skipping email delivery.`);
    // Mark today as processed to prevent redundant checking later today
    try {
      await markDateProcessed(db, currentDateStr);
    } catch (err) {
      console.error("[leads-report] Failed to save processed state:", err);
    }
    return;
  }

  console.log(`[leads-report] Found ${dirtyLeads.length} dirty/updated leads out of ${allLeads.length} total. Generating Excel attachment...`);

  // 5. Generate Excel file
  let excelBuffer: ArrayBuffer;
  try {
    excelBuffer = generateLeadsExcel(allLeads);
  } catch (err) {
    console.error("[leads-report] Error generating Excel worksheet:", err);
    return; // Do not mark processed so we can retry
  }

  // 6. Send the Email via Resend API
  const apiKey = env.RESEND_API_KEY;
  const toEmail = env.NOTIFICATION_EMAIL || "av457508@gmail.com";
  const toEmails = toEmail.split(",").map((e: string) => e.trim()).filter(Boolean);
  const fromEmail = env.RESEND_FROM_EMAIL || "Credupe <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[leads-report] Mock send to ${toEmail} since RESEND_API_KEY is not configured.`);
    // Development fallback: complete marking logic
    await completeSuccessfulRun(db, dirtyLeads, currentDateStr);
    return;
  }

  const subject = "Daily Loan Leads Report";
  const html = `
    <h3>Daily Loan Leads Report</h3>
    <p>A new lead has been submitted in the system.</p>
    <p>Please find attached the latest Loan Leads Report containing all existing and updated leads.</p>
  `;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

  try {
    const base64Content = arrayBufferToBase64(excelBuffer);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        subject,
        html,
        attachments: [
          {
            filename: `Loan_Leads_Report_${currentDateStr}.xlsx`,
            content: base64Content,
          }
        ]
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[leads-report] Failed to send email via Resend:", data);
      return; // Stop to retry next time
    }

    console.log(`[leads-report] Daily report email successfully sent to ${toEmail}`);
    await completeSuccessfulRun(db, dirtyLeads, currentDateStr);
  } catch (err) {
    console.error("[leads-report] Exception encountered sending email via Resend:", err);
  }
}

/**
 * Sets reportedAt for all reported dirty leads and registers today as processed.
 */
async function completeSuccessfulRun(db: any, dirtyLeads: any[], currentDateStr: string) {
  const nowStr = new Date().toISOString();
  const dirtyIds = dirtyLeads.map(l => l.id);

  console.log(`[leads-report] Finalizing run. Marking ${dirtyIds.length} leads as reported...`);

  try {
    // Update dirty leads' reportedAt in batches of 50
    for (let i = 0; i < dirtyIds.length; i += 50) {
      const chunk = dirtyIds.slice(i, i + 50);
      await db
        .update(leads)
        .set({ reportedAt: nowStr })
        .where(inArray(leads.id, chunk));
    }

    // Save report processed date
    await markDateProcessed(db, currentDateStr);
    console.log(`[leads-report] Daily report run completed successfully for ${currentDateStr}.`);
  } catch (err) {
    console.error("[leads-report] Failed to finalize report metadata/state:", err);
  }
}
