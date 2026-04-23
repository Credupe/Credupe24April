var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var re = Object.create;
var U = Object.defineProperty;
var se = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var oe = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var E = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "E");
var V = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "V");
var ce = /* @__PURE__ */ __name((e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !ie.call(e, n) && n !== r && U(e, n, { get: /* @__PURE__ */ __name(() => t[n], "get"), enumerable: !(a = se(t, n)) || a.enumerable });
  return e;
}, "ce");
var F = /* @__PURE__ */ __name((e, t, r) => (r = e != null ? re(oe(e)) : {}, ce(t || !e || !e.__esModule ? U(r, "default", { value: e, enumerable: true }) : r, e)), "F");
var x;
var d = E(() => {
  x = { collectedLocales: [] };
});
var h;
var u = E(() => {
  h = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/calculator/(?<nxtPslug>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/calculator/[slug].rsc?nxtPslug=$nxtPslug" }, { src: "^/calculator/(?<nxtPslug>[^/]+?)(?:/)?$", dest: "/calculator/[slug]?nxtPslug=$nxtPslug" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|O89oFssjRHVKThZF8oZyT)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { version: "15.1.3" }, crons: [] };
});
var y;
var l = E(() => {
  y = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/O89oFssjRHVKThZF8oZyT/_buildManifest.js": { type: "static" }, "/_next/static/O89oFssjRHVKThZF8oZyT/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/1028-4626d0b4deeb0e1e.js": { type: "static" }, "/_next/static/chunks/1295-758152c0c070ab12.js": { type: "static" }, "/_next/static/chunks/1321-38949c4bed3e6e71.js": { type: "static" }, "/_next/static/chunks/1517-4ba633ea590b6b4c.js": { type: "static" }, "/_next/static/chunks/1543-131f9e5fbb51a6ea.js": { type: "static" }, "/_next/static/chunks/200-be8105dab831157a.js": { type: "static" }, "/_next/static/chunks/2035-5e1671a4b881e09e.js": { type: "static" }, "/_next/static/chunks/2333-d756447547b0b55e.js": { type: "static" }, "/_next/static/chunks/2341-8354f52fb18f8673.js": { type: "static" }, "/_next/static/chunks/2880-4c0b039423914799.js": { type: "static" }, "/_next/static/chunks/3312-e8798a01f03eca03.js": { type: "static" }, "/_next/static/chunks/3380-185ebb6b43caac9e.js": { type: "static" }, "/_next/static/chunks/3778-dfa20491e70568cc.js": { type: "static" }, "/_next/static/chunks/3986-0d1698234fe4f8b6.js": { type: "static" }, "/_next/static/chunks/4077-be158feb10e5de93.js": { type: "static" }, "/_next/static/chunks/44530001-edc3eeddc62833e9.js": { type: "static" }, "/_next/static/chunks/4689-053100ec46bdfd61.js": { type: "static" }, "/_next/static/chunks/4bd1b696-cfedbfcc8ef8c3c3.js": { type: "static" }, "/_next/static/chunks/61-59881a401af8ca3c.js": { type: "static" }, "/_next/static/chunks/6145-5d9d3ec75a0da629.js": { type: "static" }, "/_next/static/chunks/6519-fe234d8b3282bbfb.js": { type: "static" }, "/_next/static/chunks/7057-f00a612aa9a2859a.js": { type: "static" }, "/_next/static/chunks/7543-f7f48f65bc8a66df.js": { type: "static" }, "/_next/static/chunks/7736-a9c0ad5bf2efb757.js": { type: "static" }, "/_next/static/chunks/9440-aa1f293404a0078b.js": { type: "static" }, "/_next/static/chunks/9916-03475fada102b5bf.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-ac848b0b9c68ab37.js": { type: "static" }, "/_next/static/chunks/app/about-us/page-8bf7d21a9084f60c.js": { type: "static" }, "/_next/static/chunks/app/business-loan/page-32283efccb276fef.js": { type: "static" }, "/_next/static/chunks/app/calculator/[slug]/page-87e4f65e70f5f5fe.js": { type: "static" }, "/_next/static/chunks/app/calculators/page-f6e8731c9beca214.js": { type: "static" }, "/_next/static/chunks/app/car-loan/page-425a7d116fddc511.js": { type: "static" }, "/_next/static/chunks/app/careers/page-1ff6fd69cab6d827.js": { type: "static" }, "/_next/static/chunks/app/contact-us/page-8a4ce48b9284ca04.js": { type: "static" }, "/_next/static/chunks/app/credit-cards/page-5331e64b957a8e86.js": { type: "static" }, "/_next/static/chunks/app/credit-score/page-6b730d96c48efa32.js": { type: "static" }, "/_next/static/chunks/app/customer-dashboard/page-e9868ad0b84b650a.js": { type: "static" }, "/_next/static/chunks/app/education-loan/page-19f50a981d3f7b1f.js": { type: "static" }, "/_next/static/chunks/app/gold-loan/page-6bbcbab49580af8c.js": { type: "static" }, "/_next/static/chunks/app/home-loan/page-3a22a1ce4b03f031.js": { type: "static" }, "/_next/static/chunks/app/layout-3171395f68ddc7b8.js": { type: "static" }, "/_next/static/chunks/app/loan-against-property/page-00941ce46c184b6f.js": { type: "static" }, "/_next/static/chunks/app/login/page-ed024ba5c5923c60.js": { type: "static" }, "/_next/static/chunks/app/micro-loan/page-32844d6ddc882a87.js": { type: "static" }, "/_next/static/chunks/app/not-found-0303049c32ddfb8b.js": { type: "static" }, "/_next/static/chunks/app/page-22c334d43ac6b30e.js": { type: "static" }, "/_next/static/chunks/app/partner-dashboard/page-34fd35760768ed95.js": { type: "static" }, "/_next/static/chunks/app/partner-gateway/page-3a299a6950f52eeb.js": { type: "static" }, "/_next/static/chunks/app/personal-loan/page-cd2148ef937edc99.js": { type: "static" }, "/_next/static/chunks/app/privacy-policy/page-694fd22307d9e2cd.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/australia/page-63da90eb8428d418.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/france/page-b8744b3868a2c3af.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/germany/page-7f54d137480a8cd2.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/ireland/page-2de81b7645d5561d.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/netherlands/page-bc0b69ce7cb5cd0e.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/new-zealand/page-912963ce793ee262.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/sweden/page-f676b8e2f35a7625.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/uk/page-c672110c59842467.js": { type: "static" }, "/_next/static/chunks/app/study-abroad/usa/page-65296bf9eea10326.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/bangalore/page-b31868d9f160b300.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/chennai/page-c5334be5a291141a.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/delhi/page-da20fed853409b54.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/hyderabad/page-312b8bbe870421db.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/kolkata/page-1a67cfd987762447.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/mumbai/page-bde7abb0a15d917f.js": { type: "static" }, "/_next/static/chunks/app/study-in-india/page-d8d1aa9b67b64301.js": { type: "static" }, "/_next/static/chunks/app/terms-and-conditions/page-003c61b486f90c3b.js": { type: "static" }, "/_next/static/chunks/app/two-wheeler-loan/page-f5aeabe61015bd2c.js": { type: "static" }, "/_next/static/chunks/app/used-car-loan/page-0b0a867ba97b8f7d.js": { type: "static" }, "/_next/static/chunks/framework-1ec85e83ffeb8a74.js": { type: "static" }, "/_next/static/chunks/main-76e2ba7d065afd3f.js": { type: "static" }, "/_next/static/chunks/main-app-52f30ef3649cf99b.js": { type: "static" }, "/_next/static/chunks/pages/_app-5f03510007f8ee45.js": { type: "static" }, "/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-786bc8dd37364a66.js": { type: "static" }, "/_next/static/css/583ed5debab3fe26.css": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/assets/about-us-hero.jpg": { type: "static" }, "/assets/about-us-illustration.png": { type: "static" }, "/assets/business-loan-hero.png": { type: "static" }, "/assets/by-type-illustration.png": { type: "static" }, "/assets/car-loan-hero.png": { type: "static" }, "/assets/cards/amex-platinum.png": { type: "static" }, "/assets/cards/axis-atlas.png": { type: "static" }, "/assets/cards/axis-reserve.png": { type: "static" }, "/assets/cards/axis-select.png": { type: "static" }, "/assets/cards/card-blue.jpeg": { type: "static" }, "/assets/cards/card-platinum.png": { type: "static" }, "/assets/cards/card-purple.jpeg": { type: "static" }, "/assets/cards/hdfc-card.png": { type: "static" }, "/assets/cards/hdfc-diners-black.png": { type: "static" }, "/assets/cards/hdfc-regalia-gold.png": { type: "static" }, "/assets/cards/icici-card.png": { type: "static" }, "/assets/cards/indianoil-rbl.png": { type: "static" }, "/assets/cards/sbi-card.png": { type: "static" }, "/assets/cards/sbi-cashback.png": { type: "static" }, "/assets/cards/tata-neu-hdfc.png": { type: "static" }, "/assets/cards/yes-paisasave.png": { type: "static" }, "/assets/careers-illustration.png": { type: "static" }, "/assets/contact-us-hero.png": { type: "static" }, "/assets/credit-card-hero.png": { type: "static" }, "/assets/credupe-advantage.png": { type: "static" }, "/assets/credupe-icon.jpg": { type: "static" }, "/assets/credupe-logo.jpeg": { type: "static" }, "/assets/education-loan-hero.png": { type: "static" }, "/assets/gold-loan-hero.png": { type: "static" }, "/assets/home-loan-hero.png": { type: "static" }, "/assets/loan-against-property-hero.png": { type: "static" }, "/assets/loan-illustration.png": { type: "static" }, "/assets/loan-steps-illustration.png": { type: "static" }, "/assets/micro-loan-hero.png": { type: "static" }, "/assets/partners/american-express.png": { type: "static" }, "/assets/partners/au-small-finance.png": { type: "static" }, "/assets/partners/axis-bank.png": { type: "static" }, "/assets/partners/cashe.png": { type: "static" }, "/assets/partners/cibil.png": { type: "static" }, "/assets/partners/clix-capital.png": { type: "static" }, "/assets/partners/credit-saison.png": { type: "static" }, "/assets/partners/crif.png": { type: "static" }, "/assets/partners/dmi-finance.png": { type: "static" }, "/assets/partners/early-salary.png": { type: "static" }, "/assets/partners/easy-home-finance.png": { type: "static" }, "/assets/partners/equifax.png": { type: "static" }, "/assets/partners/experian.png": { type: "static" }, "/assets/partners/federal-bank.png": { type: "static" }, "/assets/partners/flexiloans.png": { type: "static" }, "/assets/partners/hdb-financial.png": { type: "static" }, "/assets/partners/hdfc-bank.png": { type: "static" }, "/assets/partners/hero-fincorp.png": { type: "static" }, "/assets/partners/home-credit.png": { type: "static" }, "/assets/partners/homefirst.png": { type: "static" }, "/assets/partners/hsbc.png": { type: "static" }, "/assets/partners/icici-bank.png": { type: "static" }, "/assets/partners/idfc-first-bank.png": { type: "static" }, "/assets/partners/incred.png": { type: "static" }, "/assets/partners/indiabulls.png": { type: "static" }, "/assets/partners/indifi.png": { type: "static" }, "/assets/partners/indusind-bank.png": { type: "static" }, "/assets/partners/kotak.png": { type: "static" }, "/assets/partners/kreditbee.png": { type: "static" }, "/assets/partners/lendingkart.png": { type: "static" }, "/assets/partners/lt-finance.png": { type: "static" }, "/assets/partners/moneyview.png": { type: "static" }, "/assets/partners/muthoot-finance.png": { type: "static" }, "/assets/partners/muthoot-fincorp.png": { type: "static" }, "/assets/partners/neogrowth.png": { type: "static" }, "/assets/partners/paysense.png": { type: "static" }, "/assets/partners/pb-housing.png": { type: "static" }, "/assets/partners/piramal.png": { type: "static" }, "/assets/partners/poonawalla.png": { type: "static" }, "/assets/partners/prefr.png": { type: "static" }, "/assets/partners/protium.png": { type: "static" }, "/assets/partners/rbl-bank.png": { type: "static" }, "/assets/partners/sammaan-capital.png": { type: "static" }, "/assets/partners/sbi-card.png": { type: "static" }, "/assets/partners/sbi.png": { type: "static" }, "/assets/partners/sbm-bank.png": { type: "static" }, "/assets/partners/shriram-finance.png": { type: "static" }, "/assets/partners/sme-corner.png": { type: "static" }, "/assets/partners/smfg-india.png": { type: "static" }, "/assets/partners/standard-chartered.png": { type: "static" }, "/assets/partners/stashfin.png": { type: "static" }, "/assets/partners/tata-capital-housing.png": { type: "static" }, "/assets/partners/tata-capital.png": { type: "static" }, "/assets/partners/tvs-credit.png": { type: "static" }, "/assets/partners/ugro-capital.png": { type: "static" }, "/assets/partners/yes-bank.png": { type: "static" }, "/assets/personal-loan-about-hero.png": { type: "static" }, "/assets/personal-loan-hero.png": { type: "static" }, "/assets/search-illustration.png": { type: "static" }, "/assets/study-australia-hero.png": { type: "static" }, "/assets/study-bangalore-hero.png": { type: "static" }, "/assets/study-chennai-hero.png": { type: "static" }, "/assets/study-delhi-hero.png": { type: "static" }, "/assets/study-france-hero.png": { type: "static" }, "/assets/study-germany-hero.png": { type: "static" }, "/assets/study-hyderabad-hero.png": { type: "static" }, "/assets/study-india-hero.png": { type: "static" }, "/assets/study-ireland-hero.png": { type: "static" }, "/assets/study-kolkata-hero.png": { type: "static" }, "/assets/study-mumbai-hero.png": { type: "static" }, "/assets/study-netherlands-hero.png": { type: "static" }, "/assets/study-newzealand-hero.png": { type: "static" }, "/assets/study-sweden-hero.png": { type: "static" }, "/assets/study-uk-hero.png": { type: "static" }, "/assets/study-usa-hero.png": { type: "static" }, "/assets/two-wheeler-loan-hero.png": { type: "static" }, "/assets/used-car-loan-hero.png": { type: "static" }, "/favicon.ico": { type: "static" }, "/placeholder.svg": { type: "static" }, "/robots.txt": { type: "static" }, "/theme-preload.js": { type: "static" }, "/calculator/[slug]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/calculator/[slug].func.js" }, "/calculator/[slug].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/calculator/[slug].func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/about-us.html": { type: "override", path: "/about-us.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about-us/layout,_N_T_/about-us/page,_N_T_/about-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/about-us": { type: "override", path: "/about-us.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about-us/layout,_N_T_/about-us/page,_N_T_/about-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/about-us.rsc": { type: "override", path: "/about-us.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about-us/layout,_N_T_/about-us/page,_N_T_/about-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/business-loan.html": { type: "override", path: "/business-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/business-loan/layout,_N_T_/business-loan/page,_N_T_/business-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/business-loan": { type: "override", path: "/business-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/business-loan/layout,_N_T_/business-loan/page,_N_T_/business-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/business-loan.rsc": { type: "override", path: "/business-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/business-loan/layout,_N_T_/business-loan/page,_N_T_/business-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/calculators.html": { type: "override", path: "/calculators.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/calculators/layout,_N_T_/calculators/page,_N_T_/calculators", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/calculators": { type: "override", path: "/calculators.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/calculators/layout,_N_T_/calculators/page,_N_T_/calculators", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/calculators.rsc": { type: "override", path: "/calculators.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/calculators/layout,_N_T_/calculators/page,_N_T_/calculators", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/car-loan.html": { type: "override", path: "/car-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/car-loan/layout,_N_T_/car-loan/page,_N_T_/car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/car-loan": { type: "override", path: "/car-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/car-loan/layout,_N_T_/car-loan/page,_N_T_/car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/car-loan.rsc": { type: "override", path: "/car-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/car-loan/layout,_N_T_/car-loan/page,_N_T_/car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/careers.html": { type: "override", path: "/careers.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/careers/layout,_N_T_/careers/page,_N_T_/careers", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/careers": { type: "override", path: "/careers.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/careers/layout,_N_T_/careers/page,_N_T_/careers", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/careers.rsc": { type: "override", path: "/careers.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/careers/layout,_N_T_/careers/page,_N_T_/careers", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/contact-us.html": { type: "override", path: "/contact-us.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact-us/layout,_N_T_/contact-us/page,_N_T_/contact-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/contact-us": { type: "override", path: "/contact-us.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact-us/layout,_N_T_/contact-us/page,_N_T_/contact-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/contact-us.rsc": { type: "override", path: "/contact-us.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact-us/layout,_N_T_/contact-us/page,_N_T_/contact-us", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/credit-cards.html": { type: "override", path: "/credit-cards.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-cards/layout,_N_T_/credit-cards/page,_N_T_/credit-cards", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/credit-cards": { type: "override", path: "/credit-cards.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-cards/layout,_N_T_/credit-cards/page,_N_T_/credit-cards", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/credit-cards.rsc": { type: "override", path: "/credit-cards.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-cards/layout,_N_T_/credit-cards/page,_N_T_/credit-cards", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/credit-score.html": { type: "override", path: "/credit-score.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-score/layout,_N_T_/credit-score/page,_N_T_/credit-score", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/credit-score": { type: "override", path: "/credit-score.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-score/layout,_N_T_/credit-score/page,_N_T_/credit-score", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/credit-score.rsc": { type: "override", path: "/credit-score.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/credit-score/layout,_N_T_/credit-score/page,_N_T_/credit-score", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/customer-dashboard.html": { type: "override", path: "/customer-dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/customer-dashboard/layout,_N_T_/customer-dashboard/page,_N_T_/customer-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/customer-dashboard": { type: "override", path: "/customer-dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/customer-dashboard/layout,_N_T_/customer-dashboard/page,_N_T_/customer-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/customer-dashboard.rsc": { type: "override", path: "/customer-dashboard.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/customer-dashboard/layout,_N_T_/customer-dashboard/page,_N_T_/customer-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/education-loan.html": { type: "override", path: "/education-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/education-loan/layout,_N_T_/education-loan/page,_N_T_/education-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/education-loan": { type: "override", path: "/education-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/education-loan/layout,_N_T_/education-loan/page,_N_T_/education-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/education-loan.rsc": { type: "override", path: "/education-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/education-loan/layout,_N_T_/education-loan/page,_N_T_/education-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/gold-loan.html": { type: "override", path: "/gold-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/gold-loan/layout,_N_T_/gold-loan/page,_N_T_/gold-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/gold-loan": { type: "override", path: "/gold-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/gold-loan/layout,_N_T_/gold-loan/page,_N_T_/gold-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/gold-loan.rsc": { type: "override", path: "/gold-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/gold-loan/layout,_N_T_/gold-loan/page,_N_T_/gold-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/home-loan.html": { type: "override", path: "/home-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/home-loan/layout,_N_T_/home-loan/page,_N_T_/home-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/home-loan": { type: "override", path: "/home-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/home-loan/layout,_N_T_/home-loan/page,_N_T_/home-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/home-loan.rsc": { type: "override", path: "/home-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/home-loan/layout,_N_T_/home-loan/page,_N_T_/home-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/loan-against-property.html": { type: "override", path: "/loan-against-property.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/loan-against-property/layout,_N_T_/loan-against-property/page,_N_T_/loan-against-property", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/loan-against-property": { type: "override", path: "/loan-against-property.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/loan-against-property/layout,_N_T_/loan-against-property/page,_N_T_/loan-against-property", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/loan-against-property.rsc": { type: "override", path: "/loan-against-property.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/loan-against-property/layout,_N_T_/loan-against-property/page,_N_T_/loan-against-property", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/micro-loan.html": { type: "override", path: "/micro-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/micro-loan/layout,_N_T_/micro-loan/page,_N_T_/micro-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/micro-loan": { type: "override", path: "/micro-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/micro-loan/layout,_N_T_/micro-loan/page,_N_T_/micro-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/micro-loan.rsc": { type: "override", path: "/micro-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/micro-loan/layout,_N_T_/micro-loan/page,_N_T_/micro-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/partner-dashboard.html": { type: "override", path: "/partner-dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-dashboard/layout,_N_T_/partner-dashboard/page,_N_T_/partner-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/partner-dashboard": { type: "override", path: "/partner-dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-dashboard/layout,_N_T_/partner-dashboard/page,_N_T_/partner-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/partner-dashboard.rsc": { type: "override", path: "/partner-dashboard.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-dashboard/layout,_N_T_/partner-dashboard/page,_N_T_/partner-dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/partner-gateway.html": { type: "override", path: "/partner-gateway.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-gateway/layout,_N_T_/partner-gateway/page,_N_T_/partner-gateway", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/partner-gateway": { type: "override", path: "/partner-gateway.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-gateway/layout,_N_T_/partner-gateway/page,_N_T_/partner-gateway", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/partner-gateway.rsc": { type: "override", path: "/partner-gateway.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/partner-gateway/layout,_N_T_/partner-gateway/page,_N_T_/partner-gateway", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/personal-loan.html": { type: "override", path: "/personal-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/personal-loan/layout,_N_T_/personal-loan/page,_N_T_/personal-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/personal-loan": { type: "override", path: "/personal-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/personal-loan/layout,_N_T_/personal-loan/page,_N_T_/personal-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/personal-loan.rsc": { type: "override", path: "/personal-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/personal-loan/layout,_N_T_/personal-loan/page,_N_T_/personal-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/privacy-policy.html": { type: "override", path: "/privacy-policy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy-policy": { type: "override", path: "/privacy-policy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy-policy.rsc": { type: "override", path: "/privacy-policy.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/australia.html": { type: "override", path: "/study-abroad/australia.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/australia/layout,_N_T_/study-abroad/australia/page,_N_T_/study-abroad/australia", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/australia": { type: "override", path: "/study-abroad/australia.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/australia/layout,_N_T_/study-abroad/australia/page,_N_T_/study-abroad/australia", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/australia.rsc": { type: "override", path: "/study-abroad/australia.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/australia/layout,_N_T_/study-abroad/australia/page,_N_T_/study-abroad/australia", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/france.html": { type: "override", path: "/study-abroad/france.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/france/layout,_N_T_/study-abroad/france/page,_N_T_/study-abroad/france", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/france": { type: "override", path: "/study-abroad/france.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/france/layout,_N_T_/study-abroad/france/page,_N_T_/study-abroad/france", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/france.rsc": { type: "override", path: "/study-abroad/france.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/france/layout,_N_T_/study-abroad/france/page,_N_T_/study-abroad/france", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/germany.html": { type: "override", path: "/study-abroad/germany.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/germany/layout,_N_T_/study-abroad/germany/page,_N_T_/study-abroad/germany", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/germany": { type: "override", path: "/study-abroad/germany.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/germany/layout,_N_T_/study-abroad/germany/page,_N_T_/study-abroad/germany", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/germany.rsc": { type: "override", path: "/study-abroad/germany.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/germany/layout,_N_T_/study-abroad/germany/page,_N_T_/study-abroad/germany", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/ireland.html": { type: "override", path: "/study-abroad/ireland.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/ireland/layout,_N_T_/study-abroad/ireland/page,_N_T_/study-abroad/ireland", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/ireland": { type: "override", path: "/study-abroad/ireland.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/ireland/layout,_N_T_/study-abroad/ireland/page,_N_T_/study-abroad/ireland", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/ireland.rsc": { type: "override", path: "/study-abroad/ireland.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/ireland/layout,_N_T_/study-abroad/ireland/page,_N_T_/study-abroad/ireland", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/netherlands.html": { type: "override", path: "/study-abroad/netherlands.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/netherlands/layout,_N_T_/study-abroad/netherlands/page,_N_T_/study-abroad/netherlands", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/netherlands": { type: "override", path: "/study-abroad/netherlands.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/netherlands/layout,_N_T_/study-abroad/netherlands/page,_N_T_/study-abroad/netherlands", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/netherlands.rsc": { type: "override", path: "/study-abroad/netherlands.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/netherlands/layout,_N_T_/study-abroad/netherlands/page,_N_T_/study-abroad/netherlands", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/new-zealand.html": { type: "override", path: "/study-abroad/new-zealand.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/new-zealand/layout,_N_T_/study-abroad/new-zealand/page,_N_T_/study-abroad/new-zealand", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/new-zealand": { type: "override", path: "/study-abroad/new-zealand.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/new-zealand/layout,_N_T_/study-abroad/new-zealand/page,_N_T_/study-abroad/new-zealand", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/new-zealand.rsc": { type: "override", path: "/study-abroad/new-zealand.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/new-zealand/layout,_N_T_/study-abroad/new-zealand/page,_N_T_/study-abroad/new-zealand", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/sweden.html": { type: "override", path: "/study-abroad/sweden.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/sweden/layout,_N_T_/study-abroad/sweden/page,_N_T_/study-abroad/sweden", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/sweden": { type: "override", path: "/study-abroad/sweden.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/sweden/layout,_N_T_/study-abroad/sweden/page,_N_T_/study-abroad/sweden", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/sweden.rsc": { type: "override", path: "/study-abroad/sweden.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/sweden/layout,_N_T_/study-abroad/sweden/page,_N_T_/study-abroad/sweden", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/uk.html": { type: "override", path: "/study-abroad/uk.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/uk/layout,_N_T_/study-abroad/uk/page,_N_T_/study-abroad/uk", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/uk": { type: "override", path: "/study-abroad/uk.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/uk/layout,_N_T_/study-abroad/uk/page,_N_T_/study-abroad/uk", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/uk.rsc": { type: "override", path: "/study-abroad/uk.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/uk/layout,_N_T_/study-abroad/uk/page,_N_T_/study-abroad/uk", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-abroad/usa.html": { type: "override", path: "/study-abroad/usa.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/usa/layout,_N_T_/study-abroad/usa/page,_N_T_/study-abroad/usa", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/usa": { type: "override", path: "/study-abroad/usa.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/usa/layout,_N_T_/study-abroad/usa/page,_N_T_/study-abroad/usa", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-abroad/usa.rsc": { type: "override", path: "/study-abroad/usa.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-abroad/layout,_N_T_/study-abroad/usa/layout,_N_T_/study-abroad/usa/page,_N_T_/study-abroad/usa", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/bangalore.html": { type: "override", path: "/study-in-india/bangalore.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/bangalore/layout,_N_T_/study-in-india/bangalore/page,_N_T_/study-in-india/bangalore", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/bangalore": { type: "override", path: "/study-in-india/bangalore.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/bangalore/layout,_N_T_/study-in-india/bangalore/page,_N_T_/study-in-india/bangalore", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/bangalore.rsc": { type: "override", path: "/study-in-india/bangalore.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/bangalore/layout,_N_T_/study-in-india/bangalore/page,_N_T_/study-in-india/bangalore", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/chennai.html": { type: "override", path: "/study-in-india/chennai.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/chennai/layout,_N_T_/study-in-india/chennai/page,_N_T_/study-in-india/chennai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/chennai": { type: "override", path: "/study-in-india/chennai.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/chennai/layout,_N_T_/study-in-india/chennai/page,_N_T_/study-in-india/chennai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/chennai.rsc": { type: "override", path: "/study-in-india/chennai.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/chennai/layout,_N_T_/study-in-india/chennai/page,_N_T_/study-in-india/chennai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/delhi.html": { type: "override", path: "/study-in-india/delhi.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/delhi/layout,_N_T_/study-in-india/delhi/page,_N_T_/study-in-india/delhi", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/delhi": { type: "override", path: "/study-in-india/delhi.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/delhi/layout,_N_T_/study-in-india/delhi/page,_N_T_/study-in-india/delhi", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/delhi.rsc": { type: "override", path: "/study-in-india/delhi.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/delhi/layout,_N_T_/study-in-india/delhi/page,_N_T_/study-in-india/delhi", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/hyderabad.html": { type: "override", path: "/study-in-india/hyderabad.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/hyderabad/layout,_N_T_/study-in-india/hyderabad/page,_N_T_/study-in-india/hyderabad", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/hyderabad": { type: "override", path: "/study-in-india/hyderabad.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/hyderabad/layout,_N_T_/study-in-india/hyderabad/page,_N_T_/study-in-india/hyderabad", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/hyderabad.rsc": { type: "override", path: "/study-in-india/hyderabad.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/hyderabad/layout,_N_T_/study-in-india/hyderabad/page,_N_T_/study-in-india/hyderabad", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/kolkata.html": { type: "override", path: "/study-in-india/kolkata.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/kolkata/layout,_N_T_/study-in-india/kolkata/page,_N_T_/study-in-india/kolkata", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/kolkata": { type: "override", path: "/study-in-india/kolkata.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/kolkata/layout,_N_T_/study-in-india/kolkata/page,_N_T_/study-in-india/kolkata", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/kolkata.rsc": { type: "override", path: "/study-in-india/kolkata.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/kolkata/layout,_N_T_/study-in-india/kolkata/page,_N_T_/study-in-india/kolkata", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india/mumbai.html": { type: "override", path: "/study-in-india/mumbai.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/mumbai/layout,_N_T_/study-in-india/mumbai/page,_N_T_/study-in-india/mumbai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/mumbai": { type: "override", path: "/study-in-india/mumbai.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/mumbai/layout,_N_T_/study-in-india/mumbai/page,_N_T_/study-in-india/mumbai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india/mumbai.rsc": { type: "override", path: "/study-in-india/mumbai.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/mumbai/layout,_N_T_/study-in-india/mumbai/page,_N_T_/study-in-india/mumbai", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/study-in-india.html": { type: "override", path: "/study-in-india.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/page,_N_T_/study-in-india", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india": { type: "override", path: "/study-in-india.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/page,_N_T_/study-in-india", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/study-in-india.rsc": { type: "override", path: "/study-in-india.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/study-in-india/layout,_N_T_/study-in-india/page,_N_T_/study-in-india", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/terms-and-conditions.html": { type: "override", path: "/terms-and-conditions.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms-and-conditions/layout,_N_T_/terms-and-conditions/page,_N_T_/terms-and-conditions", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms-and-conditions": { type: "override", path: "/terms-and-conditions.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms-and-conditions/layout,_N_T_/terms-and-conditions/page,_N_T_/terms-and-conditions", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms-and-conditions.rsc": { type: "override", path: "/terms-and-conditions.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms-and-conditions/layout,_N_T_/terms-and-conditions/page,_N_T_/terms-and-conditions", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/two-wheeler-loan.html": { type: "override", path: "/two-wheeler-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/two-wheeler-loan/layout,_N_T_/two-wheeler-loan/page,_N_T_/two-wheeler-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/two-wheeler-loan": { type: "override", path: "/two-wheeler-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/two-wheeler-loan/layout,_N_T_/two-wheeler-loan/page,_N_T_/two-wheeler-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/two-wheeler-loan.rsc": { type: "override", path: "/two-wheeler-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/two-wheeler-loan/layout,_N_T_/two-wheeler-loan/page,_N_T_/two-wheeler-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/used-car-loan.html": { type: "override", path: "/used-car-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/used-car-loan/layout,_N_T_/used-car-loan/page,_N_T_/used-car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/used-car-loan": { type: "override", path: "/used-car-loan.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/used-car-loan/layout,_N_T_/used-car-loan/page,_N_T_/used-car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/used-car-loan.rsc": { type: "override", path: "/used-car-loan.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/used-car-loan/layout,_N_T_/used-car-loan/page,_N_T_/used-car-loan", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } } };
});
var q = V((We, $) => {
  "use strict";
  d();
  u();
  l();
  function f(e, t) {
    e = String(e || "").trim();
    let r = e, a, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      a = e[0];
      let i = e.lastIndexOf(a);
      n += e.substring(i + 1), e = e.substring(1, i);
    }
    let s = 0;
    return e = le(e, (i) => {
      if (/^\(\?[P<']/.test(i)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(i);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(i)}`);
        let _ = i.substring(c[0].length, i.length - 1);
        return t && (t[s] = c[1]), s++, `(${_})`;
      }
      return i.substring(0, 3) === "(?:" || s++, i;
    }), e = e.replace(/\[:([^:]+):\]/g, (i, c) => f.characterClasses[c] || i), new f.PCRE(e, n, r, n, a);
  }
  __name(f, "f");
  function le(e, t) {
    let r = 0, a = 0, n = false;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      if (n) {
        n = false;
        continue;
      }
      switch (s) {
        case "(":
          a === 0 && (r = o), a++;
          break;
        case ")":
          if (a > 0 && (a--, a === 0)) {
            let i = o + 1, c = r === 0 ? "" : e.substring(0, r), _ = e.substring(i), p = String(t(e.substring(r, i)));
            e = c + p + _, o = r;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(le, "le");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(a, n, o, s, i) {
        super(a, n), this.pcrePattern = o, this.pcreFlags = s, this.delimiter = i;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(f || (f = {}));
  f.prototype = f.PCRE.prototype;
  $.exports = f;
});
var Q = V((H) => {
  "use strict";
  d();
  u();
  l();
  H.parse = be;
  H.serialize = Se;
  var Re = Object.prototype.toString, C = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function be(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var r = {}, a = t || {}, n = a.decode || ve, o = 0; o < e.length; ) {
      var s = e.indexOf("=", o);
      if (s === -1) break;
      var i = e.indexOf(";", o);
      if (i === -1) i = e.length;
      else if (i < s) {
        o = e.lastIndexOf(";", s - 1) + 1;
        continue;
      }
      var c = e.slice(o, s).trim();
      if (r[c] === void 0) {
        var _ = e.slice(s + 1, i).trim();
        _.charCodeAt(0) === 34 && (_ = _.slice(1, -1)), r[c] = we(_, n);
      }
      o = i + 1;
    }
    return r;
  }
  __name(be, "be");
  function Se(e, t, r) {
    var a = r || {}, n = a.encode || Pe;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!C.test(e)) throw new TypeError("argument name is invalid");
    var o = n(t);
    if (o && !C.test(o)) throw new TypeError("argument val is invalid");
    var s = e + "=" + o;
    if (a.maxAge != null) {
      var i = a.maxAge - 0;
      if (isNaN(i) || !isFinite(i)) throw new TypeError("option maxAge is invalid");
      s += "; Max-Age=" + Math.floor(i);
    }
    if (a.domain) {
      if (!C.test(a.domain)) throw new TypeError("option domain is invalid");
      s += "; Domain=" + a.domain;
    }
    if (a.path) {
      if (!C.test(a.path)) throw new TypeError("option path is invalid");
      s += "; Path=" + a.path;
    }
    if (a.expires) {
      var c = a.expires;
      if (!je(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      s += "; Expires=" + c.toUTCString();
    }
    if (a.httpOnly && (s += "; HttpOnly"), a.secure && (s += "; Secure"), a.priority) {
      var _ = typeof a.priority == "string" ? a.priority.toLowerCase() : a.priority;
      switch (_) {
        case "low":
          s += "; Priority=Low";
          break;
        case "medium":
          s += "; Priority=Medium";
          break;
        case "high":
          s += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (a.sameSite) {
      var p = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
      switch (p) {
        case true:
          s += "; SameSite=Strict";
          break;
        case "lax":
          s += "; SameSite=Lax";
          break;
        case "strict":
          s += "; SameSite=Strict";
          break;
        case "none":
          s += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return s;
  }
  __name(Se, "Se");
  function ve(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(ve, "ve");
  function Pe(e) {
    return encodeURIComponent(e);
  }
  __name(Pe, "Pe");
  function je(e) {
    return Re.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(je, "je");
  function we(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(we, "we");
});
d();
u();
l();
d();
u();
l();
d();
u();
l();
var R = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
d();
u();
l();
d();
u();
l();
d();
u();
l();
d();
u();
l();
var D = F(q());
function P(e, t, r) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let a = r ? "" : "i", n = [];
  return { match: (0, D.default)(`%${e}%${a}`, n).exec(t), captureGroupKeys: n };
}
__name(P, "P");
function b(e, t, r, { namedOnly: a } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, o) => {
    let s = r.indexOf(o);
    return a && s === -1 ? n : (s === -1 ? t[parseInt(o, 10)] : t[s + 1]) || "";
  });
}
__name(b, "b");
function I(e, { url: t, cookies: r, headers: a, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, a.get(e.key), n) : { valid: a.has(e.key) };
    case "cookie": {
      let o = r[e.key];
      return o && e.value !== void 0 ? M(e.value, o, n) : { valid: o !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
function M(e, t, r) {
  let { match: a, captureGroupKeys: n } = P(e, t);
  return r && a && n.length ? { valid: !!a, newRouteDest: b(r, a, n, { namedOnly: true }) } : { valid: !!a };
}
__name(M, "M");
d();
u();
l();
function z(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", R), new Request(e, { headers: t });
}
__name(z, "z");
d();
u();
l();
function N(e, t, r) {
  let a = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, o] of a) {
    let s = n.toLowerCase(), i = r?.match ? b(o, r.match, r.captureGroupKeys) : o;
    s === "set-cookie" ? e.append(s, i) : e.set(s, i);
  }
}
__name(N, "N");
function S(e) {
  return /^https?:\/\//.test(e);
}
__name(S, "S");
function m(e, t) {
  for (let [r, a] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(r), o = /^nxtI(.+)$/.exec(r);
    n?.[1] ? (e.set(r, a), e.set(n[1], a)) : o?.[1] ? e.set(o[1], a.replace(/(\(\.+\))+/, "")) : (!e.has(r) || !!a && !e.getAll(r).includes(a)) && e.append(r, a);
  }
}
__name(m, "m");
function A(e, t) {
  let r = new URL(t, e.url);
  return m(r.searchParams, new URL(e.url).searchParams), r.pathname = r.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(r, e);
}
__name(A, "A");
function v(e) {
  return new Response(e.body, e);
}
__name(v, "v");
function L(e) {
  return e.split(",").map((t) => {
    let [r, a] = t.split(";"), n = parseFloat((a ?? "q=1").replace(/q *= */gi, ""));
    return [r.trim(), isNaN(n) ? 1 : n];
  }).sort((t, r) => r[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
d();
u();
l();
function O(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function j(e, { request: t, assetsFetcher: r, ctx: a }, { path: n, searchParams: o }) {
  let s, i = new URL(t.url);
  m(i.searchParams, o);
  let c = new Request(i, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let _ = await import(e.entrypoint);
        try {
          s = await _.default(c, a);
        } catch (p) {
          let g = p;
          throw g.name === "TypeError" && g.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        s = v(await r.fetch(A(c, e.path ?? n))), e.headers && N(s.headers, e.headers);
        break;
      }
      case "static": {
        s = await r.fetch(A(c, n));
        break;
      }
      default:
        s = new Response("Not Found", { status: 404 });
    }
  } catch (_) {
    return console.error(_), new Response("Internal Server Error", { status: 500 });
  }
  return v(s);
}
__name(j, "j");
function B(e, t) {
  let r = "^//?(?:", a = ")/(.*)$";
  return !e.startsWith(r) || !e.endsWith(a) ? false : e.slice(r.length, -a.length).split("|").every((o) => t.has(o));
}
__name(B, "B");
d();
u();
l();
function _e(e, { protocol: t, hostname: r, port: a, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(r).test(e.hostname) || a && !new RegExp(a).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(_e, "_e");
function pe(e, t) {
  if (e.method !== "GET") return;
  let { origin: r, searchParams: a } = new URL(e.url), n = a.get("url"), o = Number.parseInt(a.get("w") ?? "", 10), s = Number.parseInt(a.get("q") ?? "75", 10);
  if (!n || Number.isNaN(o) || Number.isNaN(s) || !t?.sizes?.includes(o) || s < 0 || s > 100) return;
  let i = new URL(n, r);
  if (i.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = n.startsWith("//"), _ = n.startsWith("/") && !c;
  if (!_ && !t?.domains?.includes(i.hostname) && !t?.remotePatterns?.find((T) => _e(i, T))) return;
  let p = e.headers.get("Accept") ?? "", g = t?.formats?.find((T) => p.includes(T))?.replace("image/", "");
  return { isRelative: _, imageUrl: i, options: { width: o, quality: s, format: g } };
}
__name(pe, "pe");
function he(e, t, r) {
  let a = new Headers();
  if (r?.contentSecurityPolicy && a.set("Content-Security-Policy", r.contentSecurityPolicy), r?.contentDispositionType) {
    let o = t.pathname.split("/").pop(), s = o ? `${r.contentDispositionType}; filename="${o}"` : r.contentDispositionType;
    a.set("Content-Disposition", s);
  }
  e.headers.has("Cache-Control") || a.set("Cache-Control", `public, max-age=${r?.minimumCacheTTL ?? 60}`);
  let n = v(e);
  return N(n.headers, a), n;
}
__name(he, "he");
async function G(e, { buildOutput: t, assetsFetcher: r, imagesConfig: a }) {
  let n = pe(e, a);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: o, imageUrl: s } = n, c = await (o && s.pathname in t ? r.fetch.bind(r) : fetch)(s);
  return he(c, s, a);
}
__name(G, "G");
d();
u();
l();
d();
u();
l();
d();
u();
l();
async function w(e) {
  return import(e);
}
__name(w, "w");
var ye = "x-vercel-cache-tags";
var xe = "x-next-cache-soft-tags";
var ge = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function Z(e) {
  let t = `https://${R}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let r = new URL(e.url), a = await Ne();
    if (r.pathname === "/v1/suspense-cache/revalidate") {
      let o = r.searchParams.get("tags")?.split(",") ?? [];
      for (let s of o) await a.revalidateTag(s);
      return new Response(null, { status: 200 });
    }
    let n = r.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let o = W(e, xe), s = await a.get(n, { softTags: o });
        return s ? new Response(JSON.stringify(s.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (s.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let o = globalThis[ge], s = /* @__PURE__ */ __name(async () => {
          let i = await e.json();
          i.data.tags === void 0 && (i.tags ??= W(e, ye) ?? []), await a.set(n, i);
        }, "s");
        return o ? o.ctx.waitUntil(s()) : await s(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (r) {
    return console.error(r), new Response("Error handling cache request", { status: 500 });
  }
}
__name(Z, "Z");
async function Ne() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(Ne, "Ne");
async function K(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, r = await w(t);
  return new r.default();
}
__name(K, "K");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
function X() {
  globalThis[J] || (me(), globalThis[J] = true);
}
__name(X, "X");
function me() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let r = new Request(...t), a = await fe(r);
    return a || (a = await Z(r), a) ? a : (Te(r), e(r));
  };
}
__name(me, "me");
async function fe(e) {
  if (e.url.startsWith("blob:")) try {
    let r = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, a = (await w(r)).default, n = { async arrayBuffer() {
      return a;
    }, get body() {
      return new ReadableStream({ start(o) {
        let s = Buffer.from(a);
        o.enqueue(s), o.close();
      } });
    }, async text() {
      return Buffer.from(a).toString();
    }, async json() {
      let o = Buffer.from(a);
      return JSON.stringify(o.toString());
    }, async blob() {
      return new Blob(a);
    } };
    return n.clone = () => ({ ...n }), n;
  } catch {
  }
  return null;
}
__name(fe, "fe");
function Te(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Te, "Te");
var J = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
d();
u();
l();
var Y = F(Q());
var k = class {
  static {
    __name(this, "k");
  }
  constructor(t, r, a, n, o) {
    this.routes = t;
    this.output = r;
    this.reqCtx = a;
    this.url = new URL(a.request.url), this.cookies = (0, Y.parse)(a.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), m(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = o?.find((s) => s.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: r, checkIntercept: a }) {
    let n = P(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((s) => s.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let o = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((s) => {
      let i = I(s, o);
      return i.newRouteDest && (o.routeDest = i.newRouteDest), !i.valid;
    }) && !t.missing?.find((s) => I(s, o).valid) && !(r && t.status !== this.status)) {
      if (a && t.dest) {
        let s = /\/(\(\.+\))+/, i = s.test(t.dest), c = s.test(this.path);
        if (i && !c) return;
      }
      return { routeMatch: n, routeDest: o.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let r = "x-middleware-override-headers", a = t.headers.get(r);
    if (a) {
      let c = new Set(a.split(",").map((_) => _.trim()));
      for (let _ of c.keys()) {
        let p = `x-middleware-request-${_}`, g = t.headers.get(p);
        this.reqCtx.request.headers.get(_) !== g && (g ? this.reqCtx.request.headers.set(_, g) : this.reqCtx.request.headers.delete(_)), t.headers.delete(p);
      }
      t.headers.delete(r);
    }
    let n = "x-middleware-rewrite", o = t.headers.get(n);
    if (o) {
      let c = new URL(o, this.url), _ = this.url.hostname !== c.hostname;
      this.path = _ ? `${c}` : c.pathname, m(this.searchParams, c.searchParams), t.headers.delete(n);
    }
    let s = "x-middleware-next";
    t.headers.get(s) ? t.headers.delete(s) : !o && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), N(this.reqCtx.request.headers, t.headers), N(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let r = t && this.output[t];
    if (!r || r.type !== "middleware") return this.status = 500, false;
    let a = await j(r, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), a.status === 500 ? (this.status = a.status, false) : (this.processMiddlewareResp(a), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, r, a) {
    !t.headers || (N(this.headers.normal, t.headers, { match: r, captureGroupKeys: a }), t.important && N(this.headers.important, t.headers, { match: r, captureGroupKeys: a }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, r, a) {
    if (!t.dest) return this.path;
    let n = this.path, o = t.dest;
    this.wildcardMatch && /\$wildcard/.test(o) && (o = o.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = b(o, r, a);
    let s = /\/index\.rsc$/i.test(this.path), i = /^\/(?:index)?$/i.test(n), c = /^\/__index\.prefetch\.rsc$/i.test(n);
    s && !i && !c && (this.path = n);
    let _ = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), g = this.path in this.output;
    _ && !p && !g && (this.path = this.path.replace(/\.rsc/i, ""));
    let T = new URL(this.path, this.url);
    return m(this.searchParams, T.searchParams), S(this.path) || (this.path = T.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: a, cookie: n } } = t, o = n && this.cookies[n], s = L(o ?? ""), i = L(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...s, ...i].map((g) => a[g]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, r) {
    return !this.locales || r !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, r) {
    let a = this.getLocaleFriendlyRoute(r, t), { routeMatch: n, routeDest: o } = this.checkRouteMatch(a, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, s = { ...a, dest: o };
    if (!n?.match || s.middlewarePath && this.middlewareInvoked.includes(s.middlewarePath)) return "skip";
    let { match: i, captureGroupKeys: c } = n;
    if (this.applyRouteOverrides(s), this.applyLocaleRedirects(s), !await this.runRouteMiddleware(s.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(s, i, c), this.applyRouteStatus(s);
    let p = this.applyRouteDest(s, i, c);
    if (s.check && !S(this.path)) if (p === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !s.continue || s.status && s.status >= 300 && s.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let r = true;
    for (let o of this.routes[t]) {
      let s = await this.checkRoute(t, o);
      if (s === "error") return "error";
      if (s === "done") {
        r = false;
        break;
      }
    }
    if (t === "hit" || S(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let o of this.locales) {
      let s = new RegExp(`/${o}(/.*)`), c = this.path.match(s)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let a = this.path in this.output;
    if (!a && this.path.endsWith("/")) {
      let o = this.path.replace(/\/$/, "");
      a = o in this.output, a && (this.path = o);
    }
    if (t === "miss" && !a) {
      let o = !this.status || this.status < 400;
      this.status = o ? 404 : this.status;
    }
    let n = "miss";
    return a || t === "miss" || t === "error" ? n = "hit" : r && (n = O(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let r = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), r;
  }
};
async function ee(e, t, r, a) {
  let n = new k(t.routes, r, e, a, t.wildcard), o = await te(n);
  return Ce(e, o, r);
}
__name(ee, "ee");
async function te(e, t = "none", r = false) {
  return await e.run(t) === "error" || !r && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function Ce(e, { path: t = "/404", status: r, headers: a, searchParams: n, body: o }, s) {
  let i = a.normal.get("location");
  if (i) {
    if (i !== a.middlewareLocation) {
      let p = [...n.keys()].length ? `?${n.toString()}` : "";
      a.normal.set("location", `${i ?? "/"}${p}`);
    }
    return new Response(null, { status: r, headers: a.normal });
  }
  let c;
  if (o !== void 0) c = new Response(o, { status: r });
  else if (S(t)) {
    let p = new URL(t);
    m(p.searchParams, n), c = await fetch(p, e.request);
  } else c = await j(s[t], e, { path: t, status: r, headers: a, searchParams: n });
  let _ = a.normal;
  return N(_, c.headers), N(_, a.important), c = new Response(c.body, { ...c, status: r || c.status, headers: _ }), c;
}
__name(Ce, "Ce");
d();
u();
l();
function ae() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: ke };
}
__name(ae, "ae");
function ke(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let r = Ee();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, r), r;
}
__name(ke, "ke");
function Ee() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, r) => e.has(r) ? e.get(r) : Reflect.get(globalThis, r), "get"), set: /* @__PURE__ */ __name((t, r, a) => Me.has(r) ? Reflect.set(globalThis, r, a) : (e.set(r, a), true), "set") });
}
__name(Ee, "Ee");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name((...e) => {
  let t = e[0], r = e[1], a = "__import_unsupported";
  if (!(r === a && typeof t == "object" && t !== null && a in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var va = { async fetch(e, t, r) {
  ae(), X();
  let a = await __ALSes_PROMISE__;
  if (!a) {
    let s = new URL(e.url), i = await t.ASSETS.fetch(`${s.protocol}//${s.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = i.ok ? i.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: o } = a;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: R }, async () => o.run({ env: t, ctx: r, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return G(e, { buildOutput: y, assetsFetcher: t.ASSETS, imagesConfig: h.images });
    let i = z(e);
    return ee({ request: i, ctx: r, assetsFetcher: t.ASSETS }, h, y, x);
  }));
} };
export {
  va as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.6519733273423143.mjs.map
