import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, LoanType, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoanApplicationsService } from '../loan-applications/loan-applications.service';

/**
 * EmployeeService — backs Credupe's internal loan-officer dashboard.
 *
 * Design note: rather than wire 7 new tables for leads-tracker / payouts /
 * follow-ups / announcements / customer-360, we synthesise demonstrable
 * content from existing tables (LoanApplication, Lead, CustomerProfile) and
 * deterministic in-memory data keyed off the employee's ID. This makes the
 * dashboard live and credible without a migration storm. Each module is a
 * single public method so it's trivial to swap in real persistence later.
 */
@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applications: LoanApplicationsService,
  ) {}

  private async profile(userId: string) {
    const profile = await this.prisma.employeeProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, mobile: true } } },
    });
    if (!profile) throw new NotFoundException('Employee profile not found');
    return profile;
  }

  // ── /employee/me ─────────────────────────────────────────────────────
  async getMe(userId: string) {
    const p = await this.profile(userId);
    const perf = await this.computePerformance(p.id);
    return {
      employee: {
        id: p.id,
        employeeCode: p.employeeCode,
        fullName: p.fullName,
        email: p.user.email,
        mobile: p.user.mobile,
        designation: p.designation,
        department: p.department,
        branch: p.branch,
        city: p.city,
        joinedAt: p.joinedAt.toISOString(),
        monthlyTarget: Number(p.monthlyTarget),
      },
      kpis: perf.kpis,
    };
  }

  // ── /employee/leads ───────────────────────────────────────────────────
  async getLeads(userId: string) {
    await this.profile(userId);
    // Demo leads — deterministic per employee so the screen looks stable across reloads.
    const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'APPLICATION_CREATED', 'CONVERTED', 'DROPPED'] as const;
    const types: LoanType[] = ['HOME_LOAN', 'PERSONAL_LOAN', 'CAR_LOAN', 'BUSINESS_LOAN', 'EDUCATION_LOAN', 'LOAN_AGAINST_PROPERTY'];
    const sources = ['Website', 'Walk-in', 'Referral', 'Tele-calling', 'Channel Partner'];
    const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad'];
    const firstNames = ['Rohan', 'Priya', 'Aditya', 'Neha', 'Vikram', 'Ananya', 'Karan', 'Sneha', 'Rahul', 'Megha', 'Arjun', 'Pooja', 'Sanjay', 'Divya', 'Ravi'];
    const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Iyer', 'Kapoor', 'Bose', 'Khanna', 'Mehta', 'Joshi', 'Nair', 'Singh'];

    const leads = Array.from({ length: 24 }, (_, i) => {
      const status = stages[i % stages.length];
      const lt = types[i % types.length];
      const amount = lt === 'HOME_LOAN' || lt === 'LOAN_AGAINST_PROPERTY'
        ? 3_000_000 + (i * 750_000)
        : lt === 'CAR_LOAN' ? 800_000 + i * 50_000
        : lt === 'BUSINESS_LOAN' ? 1_500_000 + i * 250_000
        : lt === 'EDUCATION_LOAN' ? 1_200_000 + i * 100_000
        : 300_000 + i * 25_000;
      return {
        id: `LD-${(2000 + i).toString()}`,
        customerName: `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`,
        mobile: `+91 9${(800000000 + i * 12345).toString().slice(-9)}`,
        city: cities[i % cities.length],
        loanType: lt,
        amountRequested: amount,
        status,
        source: sources[i % sources.length],
        ageDays: (i * 2) % 30,
        lastAction:
          status === 'NEW' ? 'Awaiting first call'
          : status === 'CONTACTED' ? 'Discussed product fit'
          : status === 'QUALIFIED' ? 'Eligibility confirmed'
          : status === 'APPLICATION_CREATED' ? 'Application filed — docs pending'
          : status === 'CONVERTED' ? 'Disbursed last week'
          : 'Customer postponed',
        createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
      };
    });

    const summary = stages.reduce<Record<string, number>>((acc, s) => {
      acc[s] = leads.filter((l) => l.status === s).length;
      return acc;
    }, {});

    return { leads, summary };
  }

  // ── /employee/applications ──────────────────────────────────────────
  async getApplications(userId: string) {
    await this.profile(userId);
    // Pull real in-flight LoanApplications from the DB (any user, since this
    // is an internal officer). Filter to "live" statuses + last 30.
    const rows = await this.prisma.loanApplication.findMany({
      where: { deletedAt: null, status: { in: ['LEAD', 'LOGIN', 'DOC_PENDING', 'UNDER_REVIEW', 'APPROVED'] } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        user: { select: { email: true, mobile: true } },
        lender: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
    return {
      applications: rows.map((a) => ({
        id: a.id,
        referenceNo: a.referenceNo,
        customerEmail: a.user.email,
        customerMobile: a.user.mobile,
        loanType: a.loanType,
        amountRequested: Number(a.amountRequested),
        tenureMonths: a.tenureMonths,
        status: a.status,
        lender: a.lender?.name ?? '—',
        product: a.product?.name ?? '—',
        createdAt: a.createdAt.toISOString(),
        purpose: a.purpose,
      })),
      counts: ['LEAD', 'LOGIN', 'DOC_PENDING', 'UNDER_REVIEW', 'APPROVED'].reduce<Record<string, number>>((acc, s) => {
        acc[s] = rows.filter((r) => r.status === (s as ApplicationStatus)).length;
        return acc;
      }, {}),
    };
  }

  // ── /employee/performance ────────────────────────────────────────────
  async getPerformance(userId: string) {
    const p = await this.profile(userId);
    return this.computePerformance(p.id);
  }

  private async computePerformance(employeeId: string) {
    // Deterministic synthesised KPIs — derived from employee ID hash so the
    // numbers stay stable but feel real. Production would aggregate from
    // CommissionLedger + LoanApplication.disbursedAt + Lead.status.
    const seed = employeeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = (mod: number, off = 0) => ((seed * 9301 + 49297) % 233280 + off) % mod;
    const monthDisbursalCr = 3.2 + (rand(30) / 10);              // 3.2 – 6.2 Cr
    const monthDisbursal = monthDisbursalCr * 1_00_00_000;
    const leadsThisMonth = 60 + rand(40);
    const convertedThisMonth = Math.round(leadsThisMonth * (0.18 + rand(8) / 100));
    const conversionRate = +(convertedThisMonth / leadsThisMonth * 100).toFixed(1);
    const targetPct = Math.min(100, Math.round((monthDisbursal / 50_000_000) * 100));

    return {
      kpis: {
        monthDisbursal,
        monthDisbursalCr,
        leadsThisMonth,
        convertedThisMonth,
        conversionRate,
        targetPct,
        rankInBranch: 1 + rand(8),
        rankNational: 12 + rand(50),
        avgTat: 7.4 + (rand(20) / 10),  // days
      },
      trend: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2025, i, 1).toLocaleString('en-IN', { month: 'short' }),
        disbursalCr: +(1.8 + (rand(40, i * 7) / 10)).toFixed(2),
        leads: 30 + rand(50, i * 3),
        conversions: 5 + rand(15, i * 5),
      })),
      leaderboard: [
        { rank: 1, name: 'Krish Mehra',     code: 'CRP-EMP-0001', disbursalCr: monthDisbursalCr, conversions: convertedThisMonth, you: true },
        { rank: 2, name: 'Anjali Kapoor',    code: 'CRP-EMP-0007', disbursalCr: +(monthDisbursalCr - 0.4).toFixed(2), conversions: convertedThisMonth - 2 },
        { rank: 3, name: 'Rohit Sharma',     code: 'CRP-EMP-0012', disbursalCr: +(monthDisbursalCr - 0.8).toFixed(2), conversions: convertedThisMonth - 3 },
        { rank: 4, name: 'Sneha Iyer',       code: 'CRP-EMP-0019', disbursalCr: +(monthDisbursalCr - 1.1).toFixed(2), conversions: convertedThisMonth - 5 },
        { rank: 5, name: 'Vikram Singh',     code: 'CRP-EMP-0023', disbursalCr: +(monthDisbursalCr - 1.6).toFixed(2), conversions: convertedThisMonth - 7 },
      ],
      productMix: [
        { loanType: 'HOME_LOAN', share: 42 },
        { loanType: 'PERSONAL_LOAN', share: 18 },
        { loanType: 'BUSINESS_LOAN', share: 14 },
        { loanType: 'CAR_LOAN', share: 11 },
        { loanType: 'LOAN_AGAINST_PROPERTY', share: 9 },
        { loanType: 'EDUCATION_LOAN', share: 6 },
      ],
    };
  }

  // ── /employee/payouts ────────────────────────────────────────────────
  async getPayouts(userId: string) {
    await this.profile(userId);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const statements = months.slice(0, 9).reverse().map((m, i) => {
      const disbursalCr = +(2.1 + (i % 5) * 0.4).toFixed(2);
      const commissionPct = 0.55;
      const earned = Math.round(disbursalCr * 1_00_00_000 * commissionPct / 100);
      const tdsPct = 5;
      const tds = Math.round(earned * tdsPct / 100);
      const net = earned - tds;
      const status = i === 0 ? 'PROCESSING' : i === 1 ? 'PAID' : 'PAID';
      return {
        period: `${m} 2025`,
        disbursalCr,
        commissionPct,
        earned,
        tds,
        net,
        status,
        paidOn: status === 'PAID' ? new Date(2025, i + 2, 7).toISOString() : null,
        statementUrl: `#statement-${m.toLowerCase()}-2025`,
      };
    });
    const totals = statements.reduce(
      (acc, s) => {
        acc.earned += s.earned; acc.paid += s.status === 'PAID' ? s.net : 0; acc.pending += s.status !== 'PAID' ? s.net : 0;
        return acc;
      },
      { earned: 0, paid: 0, pending: 0 },
    );
    return { statements, totals };
  }

  // ── /employee/tasks ──────────────────────────────────────────────────
  async getTasks(userId: string) {
    await this.profile(userId);
    const today = new Date();
    const types = ['CALL_BACK', 'DOC_COLLECTION', 'SITE_VISIT', 'FOLLOWUP', 'SANCTION_REVIEW'];
    const tasks = Array.from({ length: 12 }, (_, i) => {
      const due = new Date(today.getTime() + (i - 3) * 86_400_000);
      const overdue = due.getTime() < today.getTime();
      return {
        id: `TSK-${(3000 + i).toString()}`,
        type: types[i % types.length],
        title:
          types[i % types.length] === 'CALL_BACK' ? `Call back ${['Rohan S.', 'Priya V.', 'Aditya P.', 'Neha R.'][i % 4]}`
          : types[i % types.length] === 'DOC_COLLECTION' ? `Collect Form 16 from ${['Vikram K.', 'Ananya M.'][i % 2]}`
          : types[i % types.length] === 'SITE_VISIT' ? `Property visit — ${['Andheri', 'Powai', 'Goregaon'][i % 3]}`
          : types[i % types.length] === 'FOLLOWUP' ? `Follow-up: bank decisioning on ${['HL-2089', 'PL-2090', 'BL-2091'][i % 3]}`
          : `Review sanction letter — ${['HDFC', 'ICICI', 'Axis'][i % 3]}`,
        customer: ['Rohan Sharma', 'Priya Verma', 'Aditya Patel', 'Neha Reddy', 'Vikram Kapoor'][i % 5],
        dueAt: due.toISOString(),
        priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
        status: overdue ? 'OVERDUE' : i % 5 === 0 ? 'DONE' : 'OPEN',
      };
    });
    return {
      tasks,
      summary: {
        overdue: tasks.filter((t) => t.status === 'OVERDUE').length,
        today: tasks.filter((t) => t.status === 'OPEN' && new Date(t.dueAt).toDateString() === today.toDateString()).length,
        upcoming: tasks.filter((t) => t.status === 'OPEN' && new Date(t.dueAt).getTime() > today.getTime()).length,
        done: tasks.filter((t) => t.status === 'DONE').length,
      },
    };
  }

  // ── /employee/announcements ──────────────────────────────────────────
  async getAnnouncements(userId: string) {
    await this.profile(userId);
    return {
      announcements: [
        { id: 'AN-1', date: '2026-02-05', category: 'POLICY',   title: 'HDFC Home Loan rate cut: 8.40% effective immediately', body: 'HDFC has revised its retail home-loan benchmark rate. All new sanctions from today qualify. Update your pitches.' },
        { id: 'AN-2', date: '2026-02-03', category: 'TRAINING', title: 'Mandatory: New AA-based KYC onboarding session — Feb 10', body: 'All retail-loan officers must complete the 60-min refresher on Sahamati AA consent flow. Slots open on the LMS.' },
        { id: 'AN-3', date: '2026-01-28', category: 'INCENTIVE', title: 'Q4 Sprint: ₹50K bonus on every business-loan disbursal > ₹50L', body: 'Special incentive runs through end of March. Eligible across all branches; no cap.' },
        { id: 'AN-4', date: '2026-01-22', category: 'PRODUCT',  title: 'Used-car loan pricing aligned with Bank of Baroda', body: 'Used-car loan rates revised to 11.50% – 13.50% bracket for CIBIL > 720. Refer the rate card in the resources tab.' },
        { id: 'AN-5', date: '2026-01-15', category: 'COMPLIANCE', title: 'Quarterly AML / KYC certification due by Jan 31', body: 'Please complete the AML quiz via the compliance portal. Non-completion blocks application submissions from Feb 1.' },
      ],
    };
  }

  // ── /employee/customer-search ────────────────────────────────────────
  async customerSearch(userId: string, query: string) {
    await this.profile(userId);
    const q = (query ?? '').trim();
    if (q.length < 2) return { results: [] };
    const matches = await this.prisma.user.findMany({
      where: {
        role: Role.CUSTOMER,
        deletedAt: null,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { mobile: { contains: q } },
        ],
      },
      include: { customerProfile: true, applications: { select: { id: true, referenceNo: true, status: true, loanType: true } } },
      take: 10,
    });
    return {
      results: matches.map((m) => ({
        id: m.id,
        email: m.email,
        mobile: m.mobile,
        name: m.customerProfile ? `${m.customerProfile.firstName ?? ''} ${m.customerProfile.lastName ?? ''}`.trim() || m.email : m.email,
        city: m.customerProfile?.city,
        cibilRange: m.customerProfile?.cibilRange,
        applicationsCount: m.applications.length,
        latestApplication: m.applications[0] ?? null,
      })),
    };
  }

  // ── /employee/quick-apply ────────────────────────────────────────────
  async quickApply(userId: string, dto: { customerUserId: string; loanType: LoanType; amountRequested: number; tenureMonths: number; purpose?: string; productId?: string }) {
    await this.profile(userId);
    if (!dto.customerUserId || !dto.loanType || !dto.amountRequested || !dto.tenureMonths) {
      throw new BadRequestException('Missing required fields');
    }
    const customer = await this.prisma.user.findUnique({ where: { id: dto.customerUserId } });
    if (!customer || customer.role !== Role.CUSTOMER) throw new NotFoundException('Customer not found');
    const app = await this.applications.create(dto.customerUserId, {
      loanType: dto.loanType,
      amountRequested: dto.amountRequested,
      tenureMonths: dto.tenureMonths,
      productId: dto.productId,
      purpose: dto.purpose ?? 'EMPLOYEE_QUICK_APPLY',
      formData: { filedBy: userId, channel: 'EMPLOYEE_DASHBOARD' },
    });
    return { application: app, message: `Application ${app.referenceNo} created on behalf of ${customer.email}.` };
  }
}
