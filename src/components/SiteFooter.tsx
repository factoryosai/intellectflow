import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3">
        <div>
          <Logo size="sm" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            AI-powered Google review collection for local businesses.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">Company</span>
          <Link to="/about" className="hover:text-foreground">
            About us
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact us
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">Legal</span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy policy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms of service
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-sm text-muted-foreground md:flex-row">
          <span>
            {BRAND.email} · {BRAND.phone}
          </span>
          <span>
            {BRAND.website} · © {new Date().getFullYear()} {BRAND.parent}
          </span>
        </div>
      </div>
    </footer>
  );
}
