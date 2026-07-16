import Link from "next/link";

const siteLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-lg font-semibold tracking-tight">
            Virtu<span className="text-accent">Eaze</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-foreground/60">
            A fully interactive 3D digital twin of your project — buyers
            explore every corner of the property before construction begins.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="eyebrow text-xs uppercase text-foreground/40">
            Explore
          </span>
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="eyebrow text-xs uppercase text-foreground/40">
            Contact
          </span>
          <a
            href="mailto:contact@virtueaze.com"
            className="text-foreground/70 hover:text-foreground"
          >
            contact@virtueaze.com
          </a>
          <a href="tel:+971589468963" className="text-foreground/70 hover:text-foreground">
            UAE · +971 58 946 8963
          </a>
          <a href="tel:+919106824049" className="text-foreground/70 hover:text-foreground">
            India · +91 91068 24049
          </a>
          <p className="mt-2 text-foreground/50">
            Office 1234, XYZ Tower,
            <br />
            Business Bay, Dubai
          </p>
          <p className="text-foreground/50">
            201, ABC Complex, CG Road,
            <br />
            Ahmedabad, Gujarat 380009
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="eyebrow text-xs uppercase text-foreground/40">
            Legal
          </span>
          <Link
            href="/privacy-policy"
            className="text-foreground/70 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-foreground/70 hover:text-foreground"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 lg:px-12">
        <p className="max-w-4xl text-xs leading-relaxed text-foreground/40">
          Renderings, walkthroughs, and floor plans shown on this site are
          illustrative digital twins generated for demonstration purposes and
          may differ from the final built product.
        </p>
        <p className="mt-3 text-xs text-foreground/40">
          © {new Date().getFullYear()} VirtuEaze. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
