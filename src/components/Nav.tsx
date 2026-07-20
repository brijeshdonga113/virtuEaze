"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type PanelId = "projects" | "downloads";

type NavItem = {
  label: string;
  href?: string;
  panelId?: PanelId;
};

type PanelCard = {
  title: string;
  description: string;
  href?: string;
  imageSrc?: string;
};

type MenuPanel = {
  id: PanelId;
  height: number;
  items: PanelCard[];
};

const navItems: NavItem[] = [
  { label: "Projects", panelId: "projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Downloads", panelId: "downloads" },
];

const menuPanels: MenuPanel[] = [
  {
    id: "projects",
    height: 280,
    items: [
      {
        title: "Tremont",
        description: "Gota, Ahmedabad — Live Demo",
        href: "/projects/tremont",
        imageSrc: "/images/twin-seq/frame_0012.jpg",
      },
      {
        title: "North Wind Sanctuary",
        description: "Ahmedabad, Gujarat — Case Study",
        href: "/projects/north-wind-sanctuary",
      },
    ],
  },
  {
    id: "downloads",
    height: 176,
    items: [
      { title: "Brochure", description: "Coming soon" },
      { title: "Floor Plans", description: "Coming soon" },
    ],
  },
];

function getPanel(panelId: PanelId | null) {
  return menuPanels.find((panel) => panel.id === panelId) ?? null;
}

function PanelItemCard({ item }: { item: PanelCard }) {
  const body = (
    <>
      {item.imageSrc && (
        <div className="relative mb-3 h-20 w-full overflow-hidden rounded-lg">
          <Image src={item.imageSrc} alt="" fill sizes="220px" className="object-cover" />
        </div>
      )}
      <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-foreground/50">
        {item.description}
      </p>
    </>
  );

  if (!item.href) {
    return (
      <div className="flex min-h-[100px] cursor-default flex-col justify-end rounded-xl border border-border bg-white/[0.02] p-3 opacity-60">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="group flex min-h-[100px] flex-col justify-end rounded-xl border border-border bg-white/[0.02] p-3 transition-colors hover:border-accent/40 hover:bg-white/[0.05]"
    >
      {body}
      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent">
        Explore
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeMenu, setActiveMenu] = useState<PanelId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<PanelId | null>(null);

  useEffect(() => {
    // The header doesn't stay pinned: scrolling down slides it away so the
    // page reads full-bleed, scrolling up (or being near the top) brings it
    // back.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > 140 && y > lastY);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activePanel = getPanel(activeMenu);
  const solid = mobileOpen || scrolled;
  // Scrolling down keeps only the centered island: the logo, actions and
  // bar chrome tuck away on desktop, and the whole bar slides off on
  // mobile (which has no island).
  const shouldHide = hidden && !mobileOpen && !activeMenu;

  const toggleMenu = (panelId: PanelId) =>
    setActiveMenu((current) => (current === panelId ? null : panelId));

  const closeAll = () => {
    setMobileOpen(false);
    setActiveMenu(null);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out ${
        shouldHide ? "max-lg:-translate-y-full" : "translate-y-0"
      } ${
        solid && !shouldHide
          ? "border-b border-border bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="relative mx-auto hidden h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:flex">
        <Link
          href="/"
          className={`text-2xl font-light uppercase tracking-[0.35em] transition-all duration-500 ease-out ${
            shouldHide ? "pointer-events-none -translate-y-4 opacity-0" : ""
          }`}
        >
          Virtu<span className="text-accent">Eaze</span>
        </Link>

        <div className="absolute left-1/2 top-3 w-[420px] -translate-x-1/2">
          <motion.div
            animate={{ height: activePanel ? activePanel.height : 44 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="overflow-hidden rounded-3xl border border-border bg-background/95 shadow-lg backdrop-blur-md"
          >
            <div className="flex h-11 items-center justify-center px-3">
              <div className="flex items-center gap-1 text-xs uppercase tracking-[0.15em]">
                {navItems.map((item) =>
                  item.panelId ? (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleMenu(item.panelId!)}
                      className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 outline-none transition-colors hover:text-foreground ${
                        activeMenu === item.panelId
                          ? "bg-foreground/10 text-foreground"
                          : "text-foreground/60"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3 w-3 opacity-70 transition-transform duration-300 ${
                          activeMenu === item.panelId ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className="rounded-full px-3 py-1.5 text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activePanel && (
                <motion.div
                  key={activePanel.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-2 gap-3 border-t border-border p-3"
                >
                  {activePanel.items.map((item) => (
                    <PanelItemCard key={item.title} item={item} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div
          className={`flex items-center gap-3 transition-all duration-500 ease-out ${
            shouldHide ? "pointer-events-none -translate-y-4 opacity-0" : ""
          }`}
        >
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-full bg-accent px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            Book a Demo
          </Link>
        </div>
      </nav>

      <nav className="relative flex h-16 items-center justify-between px-5 sm:px-8 lg:hidden">
        <Link href="/" onClick={closeAll} className="text-base font-light uppercase tracking-[0.2em]">
          Virtu<span className="text-accent">Eaze</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`h-[2px] w-6 bg-foreground transition-transform ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-foreground transition-opacity ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-foreground transition-transform ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="mx-auto flex max-w-[1600px] flex-col gap-1 px-6 py-6 sm:px-8">
              {navItems.map((item) => {
                const panel = item.panelId ? getPanel(item.panelId) : null;
                const isOpen = mobileActiveMenu === item.panelId;

                if (!item.panelId) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      onClick={closeAll}
                      className="rounded-lg px-3 py-3 text-lg font-light uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileActiveMenu(isOpen ? null : item.panelId!)
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-lg font-light uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                      <ChevronDown
                        className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && panel && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-border pl-4 pt-1">
                            {panel.items.map((panelItem) =>
                              panelItem.href ? (
                                <Link
                                  key={panelItem.title}
                                  href={panelItem.href}
                                  onClick={closeAll}
                                  className="px-2 py-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
                                >
                                  {panelItem.title}
                                </Link>
                              ) : (
                                <span
                                  key={panelItem.title}
                                  className="px-2 py-2 text-sm text-foreground/40"
                                >
                                  {panelItem.title} — {panelItem.description}
                                </span>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <Link
                href="/contact"
                onClick={closeAll}
                className="mt-4 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium uppercase tracking-[0.15em] text-accent-foreground transition-opacity hover:opacity-90"
              >
                Book a Demo
              </Link>

              <div className="mt-6 flex gap-8 border-t border-border pt-6 text-xs text-foreground/50">
                <Link
                  href="/privacy-policy"
                  onClick={closeAll}
                  className="transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={closeAll}
                  className="transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
