import { motion } from "framer-motion";

const axisBank = "/assets/partners/axis-bank.png";
const federalBank = "/assets/partners/federal-bank.png";
const hdfcBank = "/assets/partners/hdfc-bank.png";
const iciciBank = "/assets/partners/icici-bank.png";
const idfcFirstBank = "/assets/partners/idfc-first-bank.png";
const indusindBank = "/assets/partners/indusind-bank.png";
const kotak = "/assets/partners/kotak.png";
const sbi = "/assets/partners/sbi.png";
const yesBank = "/assets/partners/yes-bank.png";
const rblBank = "/assets/partners/rbl-bank.png";
const auSmallFinance = "/assets/partners/au-small-finance.png";
const hsbc = "/assets/partners/hsbc.png";
const standardChartered = "/assets/partners/standard-chartered.png";
const sbmBank = "/assets/partners/sbm-bank.png";
const hdbFinancial = "/assets/partners/hdb-financial.png";
const tataCapital = "/assets/partners/tata-capital.png";
const ltFinance = "/assets/partners/lt-finance.png";
const muthootFinance = "/assets/partners/muthoot-finance.png";
const heroFincorp = "/assets/partners/hero-fincorp.png";
const poonawalla = "/assets/partners/poonawalla.png";
const indiabulls = "/assets/partners/indiabulls.png";
const homeCredit = "/assets/partners/home-credit.png";
const tvsCredit = "/assets/partners/tvs-credit.png";
const piramal = "/assets/partners/piramal.png";
const stashfin = "/assets/partners/stashfin.png";
const dmiFinance = "/assets/partners/dmi-finance.png";
const protium = "/assets/partners/protium.png";
const homefirst = "/assets/partners/homefirst.png";
const partners = [
  [
    { name: "Axis Bank", logo: axisBank },
    { name: "Federal Bank", logo: federalBank },
    { name: "HDFC Bank", logo: hdfcBank },
    { name: "ICICI Bank", logo: iciciBank },
    { name: "IDFC First Bank", logo: idfcFirstBank },
    { name: "IndusInd Bank", logo: indusindBank },
    { name: "Kotak", logo: kotak },
  ],
  [
    { name: "SBI", logo: sbi },
    { name: "Yes Bank", logo: yesBank },
    { name: "RBL Bank", logo: rblBank },
    { name: "AU Small Finance", logo: auSmallFinance },
    { name: "HSBC", logo: hsbc },
    { name: "Standard Chartered", logo: standardChartered },
    { name: "SBM Bank", logo: sbmBank },
  ],
  [
    { name: "HDB Financial", logo: hdbFinancial },
    { name: "Tata Capital", logo: tataCapital },
    { name: "L&T Finance", logo: ltFinance },
    { name: "Muthoot Finance", logo: muthootFinance },
    { name: "Hero FinCorp", logo: heroFincorp },
    { name: "Poonawalla", logo: poonawalla },
    { name: "Indiabulls", logo: indiabulls },
  ],
  [
    { name: "Home Credit", logo: homeCredit },
    { name: "TVS Credit", logo: tvsCredit },
    { name: "Piramal", logo: piramal },
    { name: "Stashfin", logo: stashfin },
    { name: "DMI Finance", logo: dmiFinance },
    { name: "Protium", logo: protium },
    { name: "HomeFirst", logo: homefirst },
  ],
];

const BankingPartnersSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {partners.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-4"
            >
              {row.map((partner, colIndex) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (rowIndex * 7 + colIndex) * 0.015 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-primary/15 bg-card hover:bg-primary/5 hover:border-primary/25 hover:shadow-lg transition-all duration-300 cursor-default h-28 gap-2"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-14 max-w-full object-contain"
                    loading="lazy"
                  />
                  <span className="text-[11px] font-bold text-foreground/90 text-center leading-tight tracking-tight">
                    {partner.name}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground text-sm">
            ...and <span className="font-semibold text-primary">50+ more</span> lending partners across India
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BankingPartnersSection;
