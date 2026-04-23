"use client";

/**
 * Compatibility shim that maps a subset of `react-router-dom` v6 onto
 * Next.js App Router primitives (`next/link`, `next/navigation`). The
 * `@/tsconfig.json` `paths` entry aliases `react-router-dom` to this
 * module, so existing pages/components compile unchanged.
 */
import NextLink from "next/link";
import {
  useRouter,
  usePathname,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import * as React from "react";

type AnyProps = Record<string, any>;

function toHref(to: any): string {
  if (to == null) return "#";
  if (typeof to === "string") return to;
  if (typeof to === "object") {
    const pathname = to.pathname || "";
    const search = to.search || "";
    const hash = to.hash || "";
    return `${pathname}${search}${hash}`;
  }
  return String(to);
}

export const Link = React.forwardRef<HTMLAnchorElement, AnyProps>(function Link(
  { to, href, replace, state, relative, preventScrollReset, reloadDocument, children, ...rest },
  ref,
) {
  const target = toHref(to ?? href);
  return (
    <NextLink ref={ref as any} href={target} prefetch={false} {...rest}>
      {children}
    </NextLink>
  );
});

export const NavLink = React.forwardRef<HTMLAnchorElement, AnyProps>(function NavLink(
  { to, href, className, style, children, end, ...rest },
  ref,
) {
  const target = toHref(to ?? href);
  const pathname = usePathname();
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(target + "/");
  const resolvedClassName =
    typeof className === "function" ? className({ isActive, isPending: false }) : className;
  const resolvedStyle = typeof style === "function" ? style({ isActive, isPending: false }) : style;
  const resolvedChildren =
    typeof children === "function" ? children({ isActive, isPending: false }) : children;
  return (
    <NextLink ref={ref as any} href={target} prefetch={false} className={resolvedClassName} style={resolvedStyle} {...rest}>
      {resolvedChildren}
    </NextLink>
  );
});

export function useNavigate() {
  const router = useRouter();
  return React.useCallback(
    (to: any, opts?: { replace?: boolean }) => {
      if (typeof to === "number") {
        if (to < 0) router.back();
        else router.forward();
        return;
      }
      const target = toHref(to);
      if (opts?.replace) router.replace(target);
      else router.push(target);
    },
    [router],
  );
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const params = useNextParams() as Record<string, string | string[]> | null;
  if (!params) return {} as T;
  // Flatten array params (catch-all) to strings to mirror RRD behaviour.
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    out[k] = Array.isArray(v) ? v.join("/") : (v as string);
  }
  return out as T;
}

export function useLocation() {
  const pathname = usePathname();
  const search = useNextSearchParams();
  const searchStr = search?.toString();
  return {
    pathname,
    search: searchStr ? `?${searchStr}` : "",
    hash: typeof window !== "undefined" ? window.location.hash : "",
    state: null as any,
    key: "default",
  };
}

export function useSearchParams() {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const setParams = React.useCallback(
    (next: URLSearchParams | Record<string, string>) => {
      const usp = next instanceof URLSearchParams ? next : new URLSearchParams(next);
      const q = usp.toString();
      router.replace(q ? `${pathname}?${q}` : pathname);
    },
    [router, pathname],
  );
  const current = new URLSearchParams(params?.toString() || "");
  return [current, setParams] as const;
}

// Route / Routes / BrowserRouter / Navigate / Outlet: Next.js handles routing
// at the filesystem level — these are rendered as no-ops / passthroughs so
// legacy `<Routes>` blocks inside copied pages won't crash if anyone imports
// them, but we never actually rely on them for routing in this port.
export const BrowserRouter: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const HashRouter = BrowserRouter;
export const MemoryRouter = BrowserRouter;
export const Routes: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Route: React.FC<AnyProps> = () => null;
export const Outlet: React.FC = () => null;
export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace }) => {
  const router = useRouter();
  React.useEffect(() => {
    const target = toHref(to);
    if (replace) router.replace(target);
    else router.push(target);
  }, [to, replace, router]);
  return null;
};
