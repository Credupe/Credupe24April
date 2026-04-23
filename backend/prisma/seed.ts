/* eslint-disable no-console */
import 'dotenv/config';
import { LoanType, NotificationChannel, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@credupe.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  // ── Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash, role: Role.ADMIN },
    update: { passwordHash, role: Role.ADMIN, isActive: true },
  });
  console.log('→ admin:', admin.email);

  // ── Demo customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@credupe.local' },
    create: {
      email: 'customer@credupe.local',
      passwordHash: await bcrypt.hash('Customer@123', salt),
      role: Role.CUSTOMER,
      mobile: '+919999900001',
      customerProfile: {
        create: {
          firstName: 'Rohan', lastName: 'Sharma', city: 'Mumbai', state: 'MH',
          pincode: '400001', monthlyIncome: 120000 as any, cibilRange: '750-800',
          employmentType: 'SALARIED',
        },
      },
    },
    update: {},
  });

  // ── Demo partner
  const partner = await prisma.user.upsert({
    where: { email: 'partner@credupe.local' },
    create: {
      email: 'partner@credupe.local',
      passwordHash: await bcrypt.hash('Partner@123', salt),
      role: Role.PARTNER,
      mobile: '+919999900002',
      partnerProfile: {
        create: { businessName: 'Acme Financial Services', contactPerson: 'Neha Verma', city: 'Bangalore', state: 'KA', kycStatus: 'VERIFIED' },
      },
    },
    update: {},
  });

  // ── Lenders
  const lenderSeeds = [
    { name: 'HDFC Bank',  slug: 'hdfc-bank' },
    { name: 'ICICI Bank', slug: 'icici-bank' },
    { name: 'Axis Bank',  slug: 'axis-bank' },
    { name: 'SBI',        slug: 'sbi' },
    { name: 'Bajaj Finserv', slug: 'bajaj-finserv' },
  ];
  const lenders = [];
  for (const l of lenderSeeds) {
    lenders.push(await prisma.lender.upsert({
      where: { slug: l.slug },
      create: { name: l.name, slug: l.slug, active: true, integrationMode: 'mock' },
      update: {},
    }));
  }

  // ── Loan products (one PL + one HL per lender, varied rates)
  const productSeeds: any[] = [];
  lenders.forEach((lender, idx) => {
    productSeeds.push({
      slug: `${lender.slug}-personal-loan`,
      name: `${lender.name} Personal Loan`,
      lenderId: lender.id,
      loanType: LoanType.PERSONAL_LOAN,
      minAmount: 50000, maxAmount: 4000000,
      minTenureMonths: 12, maxTenureMonths: 60,
      minInterestRate: 10.49 + idx * 0.25, maxInterestRate: 18 + idx * 0.25,
      processingFeePct: 1.5, commissionPct: 1.0,
      minMonthlyIncome: 25000, minCibilScore: 700, active: true,
    });
    productSeeds.push({
      slug: `${lender.slug}-home-loan`,
      name: `${lender.name} Home Loan`,
      lenderId: lender.id,
      loanType: LoanType.HOME_LOAN,
      minAmount: 500000, maxAmount: 50000000,
      minTenureMonths: 60, maxTenureMonths: 360,
      minInterestRate: 8.4 + idx * 0.1, maxInterestRate: 11 + idx * 0.1,
      processingFeePct: 0.5, commissionPct: 0.5,
      minMonthlyIncome: 40000, minCibilScore: 720, active: true,
    });
  });
  for (const p of productSeeds) {
    await prisma.loanProduct.upsert({
      where: { slug: p.slug },
      create: p,
      update: {},
    });
  }

  // ── Notification templates
  const templates = [
    { code: 'APPLICATION_STATUS_CHANGED', channel: NotificationChannel.IN_APP, subject: 'Application update', body: 'Your application {{referenceNo}} is now {{status}}.' },
    { code: 'OTP_LOGIN', channel: NotificationChannel.SMS, subject: null, body: 'Your Credupe OTP is {{code}}. Valid 5 min.' },
    { code: 'LEAD_CREATED', channel: NotificationChannel.EMAIL, subject: 'New lead received', body: 'A new lead {{customerName}} has been created.' },
  ];
  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { code: t.code },
      create: t as any,
      update: t as any,
    });
  }

  console.log(`✓ seed done — admin=${adminEmail}, customer=customer@credupe.local (Customer@123), partner=partner@credupe.local (Partner@123)`);
  console.log(`  lenders=${lenders.length}, products=${productSeeds.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
