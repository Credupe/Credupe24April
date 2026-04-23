import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import type Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoanProductsService } from '../loan-products/loan-products.service';
import { LoanApplicationsService } from '../loan-applications/loan-applications.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { CreateQuoteDto, ConvertQuoteDto } from './dto/quote.dto';
import { monthlyEmi, totalInterest } from './emi.util';
/**
 * Pre-qualified offers engine — the single highest-leverage route for
 * loan-marketplace conversion. Takes a customer profile snapshot + loan
 * params, runs them through the existing eligibility engine, computes
 * best-case and worst-case EMI at each lender's rate band, ranks the
 * resulting offers, persists the quote in Redis (TTL 24h) and returns a
 * `quoteId` the customer can convert into a real application with one click.
 */
@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: LoanProductsService,
    private readonly apps: LoanApplicationsService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private quoteKey(id: string) { return `quote:${id}`; }
  private shareKey(slug: string) { return `qshare:${slug}`; }

  async create(dto: CreateQuoteDto, userId?: string) {
    const match = await this.products.matchOffers({
      loanType: dto.loanType,
      amount: dto.amount,
      tenureMonths: dto.tenureMonths,
      monthlyIncome: dto.monthlyIncome,
      cibilScore: dto.cibilScore,
      city: dto.city,
      state: dto.state,
    });

    const ranked = match.offers
      .map((o) => {
        const principal = Number(o.prequalifiedAmount);
        const bestRate = Number(o.interestRateRange.min);
        const worstRate = Number(o.interestRateRange.max);
        const emiBest = monthlyEmi(principal, bestRate, dto.tenureMonths);
        const emiWorst = monthlyEmi(principal, worstRate, dto.tenureMonths);
        const processingFee = o.processingFeePct
          ? Math.round(principal * Number(o.processingFeePct)) / 100
          : 0;
        return {
          ...o,
          principal,
          tenureMonths: dto.tenureMonths,
          emi: { best: emiBest, worst: emiWorst, rateBest: bestRate, rateWorst: worstRate },
          processingFee,
          totalInterestBest: totalInterest(principal, emiBest, dto.tenureMonths),
          totalPayableBest: Math.round((emiBest * dto.tenureMonths + processingFee) * 100) / 100,
        };
      })
      .sort((a, b) => a.emi.best - b.emi.best);

    const id = `Q-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const quote = {
      id,
      userId: userId ?? null,
      loanType: dto.loanType,
      amount: dto.amount,
      tenureMonths: dto.tenureMonths,
      profile: {
        monthlyIncome: dto.monthlyIncome,
        cibilScore: dto.cibilScore,
        city: dto.city,
        state: dto.state,
      },
      contact: (!userId && (dto.fullName || dto.mobile || dto.email))
        ? { fullName: dto.fullName, mobile: dto.mobile, email: dto.email }
        : undefined,
      offers: ranked,
      offersCount: ranked.length,
      bestOffer: ranked[0] ?? null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    await this.redis.set(this.quoteKey(id), JSON.stringify(quote), 'EX', 24 * 3600);
    return quote;
  }

  async getById(id: string) {
    const raw = await this.redis.get(this.quoteKey(id));
    if (!raw) throw new NotFoundException('Quote not found or expired');
    return JSON.parse(raw);
  }

  /** One-click conversion: persist the quote as a real LoanApplication (LEAD). */
  async convertToApplication(id: string, userId: string, dto: ConvertQuoteDto) {
    const quote = await this.getById(id);
    const chosen = dto.productId
      ? quote.offers.find((o: any) => o.productId === dto.productId)
      : quote.bestOffer;
    if (!chosen) throw new BadRequestException({ error: 'NO_MATCHING_OFFER', message: 'No matching offer on the quote' });

    const app = await this.apps.create(userId, {
      loanType: quote.loanType,
      amountRequested: quote.amount,
      tenureMonths: quote.tenureMonths,
      productId: chosen.productId,
      purpose: dto.purpose,
      formData: {
        sourceQuoteId: id,
        expectedEmi: chosen.emi.best,
        expectedRate: chosen.emi.rateBest,
        lender: chosen.lender?.name,
      },
    });
    return { application: app, appliedOffer: chosen, status: ApplicationStatus.LEAD };
  }

  /**
   * Create a public, read-only share link for a quote. Issues a short
   * alphanumeric slug stored in Redis (key `qshare:<slug>` → quoteId) with
   * a 7-day TTL. Anyone with the slug can view the quote (ranked offers,
   * EMI, processing fee) but NOT the PII (contact / profile) stored on
   * the underlying quote — those fields are stripped from the public view.
   */
  async createShare(id: string) {
    await this.getById(id); // ensures quote exists + still valid
    const slug = randomBytes(6).toString('base64url'); // ~8 chars, URL-safe
    const ttlSec = 7 * 24 * 3600;
    await this.redis.set(this.shareKey(slug), id, 'EX', ttlSec);
    return {
      slug,
      shareUrl: `/q/${slug}`,
      expiresAt: new Date(Date.now() + ttlSec * 1000).toISOString(),
    };
  }

  /** Public view via share slug — returns a sanitised copy (no PII). */
  async getBySlug(slug: string) {
    const quoteId = await this.redis.get(this.shareKey(slug));
    if (!quoteId) throw new NotFoundException('Share link not found or expired');
    const quote = await this.getById(quoteId);
    const { userId, contact, profile, ...publicQuote } = quote as any;
    return {
      ...publicQuote,
      // keep coarse profile context (helpful) but drop anything identifying
      profile: profile ? { city: profile.city, state: profile.state } : undefined,
      sharedVia: slug,
    };
  }
}
