"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const projectLinks = [
  { href: "/projects#tremont", label: "Tremont" },
  { href: "/projects#north-wind-sanctuary", label: "North Wind Sanctuary" },
];

const menuLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = open || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8">
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-start justify-center gap-[5px]"
        >
          <span
            className={`h-[2px] w-6 bg-foreground transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-foreground transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-foreground transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 text-base font-light uppercase tracking-[0.2em] sm:text-2xl sm:tracking-[0.35em]"
        >
          Virtu<span className="text-accent">Eaze</span>
        </Link>

        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-foreground sm:gap-8 sm:text-sm">
          <Link
            href="/contact"
            className="transition-opacity hover:opacity-70"
          >
            Inquire
          </Link>

          <div className="group relative hidden md:block">
            <span className="cursor-default transition-opacity hover:opacity-70">
              Downloads
            </span>
            <div className="invisible absolute right-0 top-full pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="flex min-w-[200px] flex-col border border-border bg-background/95 py-2 backdrop-blur-md">
                <span className="px-5 py-2.5 text-foreground/40">
                  Brochure — soon
                </span>
                <span className="px-5 py-2.5 text-foreground/40">
                  Floor Plans — soon
                </span>
              </div>
            </div>
          </div>

          <span className="hidden items-center gap-2 sm:flex">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            EN
          </span>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-10 sm:px-8">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
            {menuLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-light uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground sm:text-3xl"
                >
                  {link.label}
                </Link>
                {link.href === "/projects" && (
                  <div className="mt-4 flex flex-col gap-3 border-l border-border pl-5">
                    {projectLinks.map((project) => (
                      <Link
                        key={project.href}
                        href={project.href}
                        onClick={() => setOpen(false)}
                        className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                      >
                        {project.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block w-fit rounded-full border border-accent/60 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-accent hover:text-background"
            >
              Book a Demo
            </Link>
            <div className="mt-6 flex gap-8 border-t border-border pt-6 text-xs text-foreground/50">
              <Link
                href="/privacy-policy"
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
