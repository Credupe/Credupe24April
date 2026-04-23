import { X, Building2, BadgePercent, FileText, ChevronRight, IndianRupee, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { productSidebarDataMap, type LenderDetail, type InsightArticle, type RateComparison, type EligibilityDetail } from "@/data/sidebarContent";

type ContentType = "lender" | "insight" | "rate" | "eligibility";

interface SidebarContentPanelProps {
  productName: string;
  selectedSlug: string | null;
  selectedType: ContentType | null;
  onClose: () => void;
}

const LenderContent = ({ lender }: { lender: LenderDetail }) => (
  <div className="space-y-6">
    <div className="rounded-xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-5 h-5 text-white/80" />
        <h3 className="text-lg font-bold">{lender.name}</h3>
      </div>
      <p className="text-sm text-white/70">{lender.description}</p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <span className="text-[11px] text-muted-foreground block">Interest Rate</span>
        <span className="text-sm font-bold text-primary">{lender.interestRate}</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <span className="text-[11px] text-muted-foreground block">Processing Fee</span>
        <span className="text-sm font-bold text-foreground">{lender.processingFee}</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <span className="text-[11px] text-muted-foreground block">Max Amount</span>
        <span className="text-sm font-bold text-foreground">{lender.maxAmount}</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <span className="text-[11px] text-muted-foreground block">Tenure</span>
        <span className="text-sm font-bold text-foreground">{lender.tenure}</span>
      </div>
    </div>

    <div>
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-primary" /> Eligibility Criteria
      </h4>
      <ul className="space-y-2">
        {lender.eligibility.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <ChevronRight className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" /> Documents Required
      </h4>
      <ul className="space-y-2">
        {lender.documents.map((doc, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <ChevronRight className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" />
            {doc}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <BadgePercent className="w-4 h-4 text-primary" /> Key Features
      </h4>
      <ul className="space-y-2">
        {lender.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const InsightContent = ({ insight }: { insight: InsightArticle }) => (
  <div className="space-y-5">
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <h3 className="text-base font-bold text-foreground mb-2">{insight.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>
    </div>

    <div>
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" /> Key Points
      </h4>
      <ul className="space-y-3">
        {insight.keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const RateContent = ({ rate }: { rate: RateComparison }) => (
  <div className="space-y-5">
    <div className="rounded-xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-5 text-white">
      <span className="text-[11px] text-white/60 block mb-1">{rate.bank}</span>
      <h3 className="text-lg font-bold mb-1">{rate.title}</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-primary">{rate.rate}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3">
      <div className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Effective Rate (incl. fees)</span>
        <span className="text-xs font-bold text-foreground">{rate.effectiveRate}</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Processing Fee</span>
        <span className="text-xs font-bold text-foreground">{rate.processingFee}</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Prepayment/Foreclosure</span>
        <span className="text-xs font-bold text-foreground">{rate.prepayment}</span>
      </div>
    </div>

    <div>
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <IndianRupee className="w-4 h-4 text-primary" /> Rate Details
      </h4>
      <ul className="space-y-2">
        {rate.details.map((detail, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <ChevronRight className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const EligibilityContent = ({ item }: { item: EligibilityDetail }) => (
  <div className="space-y-5">
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
    </div>

    <div>
      <ul className="space-y-3">
        {item.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SidebarContentPanel = ({ productName, selectedSlug, selectedType, onClose }: SidebarContentPanelProps) => {
  if (!selectedSlug || !selectedType) return null;

  const data = productSidebarDataMap[productName];
  if (!data) return null;

  let content: React.ReactNode = null;
  let title = "";

  switch (selectedType) {
    case "lender": {
      const lender = data.lenders.find(l => l.slug === selectedSlug);
      if (lender) { content = <LenderContent lender={lender} />; title = lender.name; }
      break;
    }
    case "insight": {
      const insight = data.insights.find(a => a.slug === selectedSlug);
      if (insight) { content = <InsightContent insight={insight} />; title = insight.title; }
      break;
    }
    case "rate": {
      const rate = data.rates.find(r => r.slug === selectedSlug);
      if (rate) { content = <RateContent rate={rate} />; title = rate.title; }
      break;
    }
    case "eligibility": {
      const item = data.eligibilityDocs.find(e => e.slug === selectedSlug);
      if (item) { content = <EligibilityContent item={item} />; title = item.title; }
      break;
    }
  }

  if (!content) return null;

  return (
    <div className="scroll-mt-24 mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {productName}
        </button>
      </div>
      {content}
    </div>
  );
};

export default SidebarContentPanel;
