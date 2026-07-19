"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import FloorPlanSvg from "@/components/FloorPlanSvg";
import type { MotionState } from "@/components/experience/ExperienceScene";

const ExperienceScene = dynamic(
  () => import("@/components/experience/ExperienceScene"),
  { ssr: false },
);

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

// Homepage palette — the experience shares the site's dark luxury brand.
const BG = "#0a0a0a";
const INK = "#f2f0ea";
const GOLD = "#c9a44c";
const GOLD_INK = "#14140f";

// Same film grain as the homepage hero.
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SMOOTHING = 6;
const SCROLL_LENGTH_VH = 640;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/#" },
  { label: "Showcase", href: "/projects" },
  { label: "Technology", href: "/hero-preview" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

const LITE_QUERIES = ["(max-width: 820px)", "(pointer: coarse)"];

// Small screens and touch devices get the static fallback; the server
// snapshot assumes desktop and hydration corrects it.
function useLiteDevice() {
  return useSyncExternalStore(
    (onChange) => {
      const lists = LITE_QUERIES.map((q) => window.matchMedia(q));
      lists.forEach((l) => l.addEventListener("change", onChange));
      return () =>
        lists.forEach((l) => l.removeEventListener("change", onChange));
    },
    () => LITE_QUERIES.some((q) => window.matchMedia(q).matches),
    () => false,
  );
}

class SceneBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#0a0a0a]/70 shadow-[0_2px_24px_rgba(0,0,0,0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/experience"
          className="text-2xl font-light uppercase tracking-[0.3em]"
          style={{ color: INK }}
        >
          Virtu<span style={{ color: GOLD }}>Eaze</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#f2f0ea]/75 transition-all hover:text-[#f2f0ea]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90 md:block"
            style={{ backgroundColor: GOLD, color: GOLD_INK }}
          >
            Book Demo
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-[#f2f0ea] md:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#141412]/95 p-5 shadow-xl backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-[#f2f0ea]/85 transition-colors hover:bg-white/5 hover:text-[#f2f0ea]"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 rounded-full px-5 py-2.5 text-center text-sm font-medium"
                style={{ backgroundColor: GOLD, color: GOLD_INK }}
              >
                Book Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="eyebrow text-xs font-semibold uppercase text-[#c9a44c]">
        Interactive Real Estate
      </p>
      <h1 className="mt-5 font-light leading-none tracking-tighter">
        <span className="block text-6xl text-[#f2f0ea]/45 md:text-7xl lg:text-8xl">
          Experience.
        </span>
        <span
          className="-mt-2 block text-6xl md:-mt-3 md:text-7xl lg:text-8xl"
          style={{ color: INK }}
        >
          Tomorrow&apos;s Homes.
        </span>
      </h1>
      <p className="mx-auto mt-7 max-w-[700px] text-lg text-[#f2f0ea]/65 md:text-xl">
        Transform blueprints into immersive digital experiences that help
        buyers explore, understand and purchase with confidence.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <motion.a
          whileHover={{ y: -2 }}
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-8 py-3 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD, color: GOLD_INK }}
        >
          Book Demo
        </motion.a>
        <motion.span whileHover={{ y: -2 }} className="inline-block">
          <a
            href="#experience-end"
            className="inline-block rounded-full border border-[#f2f0ea]/30 px-8 py-3 text-sm font-medium transition-colors hover:border-[#c9a44c]"
            style={{ color: INK }}
          >
            Explore Experience
          </a>
        </motion.span>
      </div>
    </>
  );
}

// The homepage's "How It Works" steps, surfaced as beats of the dive.
type StepSpec = {
  step: string;
  title: string;
  text: string;
  window: [number, number, number, number];
  className: string;
};

const STEPS: StepSpec[] = [
  {
    step: "01",
    title: "Share your drawings",
    text: "Plans, elevations and details.",
    window: [0.22, 0.28, 0.38, 0.44],
    className: "right-6 top-1/2 -translate-y-1/2 lg:right-16",
  },
  {
    step: "02",
    title: "We build your Digital Twin",
    text: "Modeling, lighting and interactions.",
    window: [0.5, 0.56, 0.66, 0.71],
    className: "right-6 top-[58%] lg:right-16",
  },
  {
    step: "03",
    title: "Go live",
    text: "Use it on mobile, desktop or VR.",
    window: [0.72, 0.78, 0.83, 0.88],
    className: "left-6 top-[56%] lg:left-16",
  },
];

export default function LuxuryExperience() {
  const motionRef = useRef<MotionState>({ p: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const planRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const liteDevice = useLiteDevice();
  const mode: "3d" | "lite" = sceneFailed || liteDevice ? "lite" : "3d";

  useEffect(() => {
    if (mode !== "3d") return;
    let raf: number;
    let smooth: number | null = null;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const target =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      smooth =
        smooth === null
          ? target
          : Math.abs(target - smooth) < 0.0004
            ? target
            : smooth + (target - smooth) * (1 - Math.exp(-dt * SMOOTHING));
      const p = smooth;
      motionRef.current.p = p;

      if (heroRef.current) {
        const o = 1 - smoothstep(0.015, 0.09, p);
        heroRef.current.style.opacity = String(o);
        heroRef.current.style.transform = `translateY(${smoothstep(0.015, 0.09, p) * -26}px)`;
        heroRef.current.style.pointerEvents = o < 0.05 ? "none" : "auto";
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - smoothstep(0.01, 0.05, p));
      }
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b, c, d] = STEPS[i].window;
        const fin = smoothstep(a, b, p);
        const o = Math.min(fin, 1 - smoothstep(c, d, p));
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - fin) * 22}px)`;
      });
      if (planRef.current) {
        // After the interior beat — the plan reads as "what you just walked".
        const fin = smoothstep(0.88, 0.93, p);
        const o = Math.min(fin, 1 - smoothstep(0.955, 0.985, p));
        planRef.current.style.opacity = String(o);
        planRef.current.style.transform = `translateY(${(1 - fin) * 26}px) scale(${0.96 + fin * 0.04})`;
      }
      if (finalRef.current) {
        const o = smoothstep(0.955, 0.995, p);
        finalRef.current.style.opacity = String(o);
        finalRef.current.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: INK }}>
      <GlassNav />

      {mode !== "lite" ? (
        <div
          ref={sectionRef}
          className="relative w-full"
          style={{ height: `${SCROLL_LENGTH_VH}vh` }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {mode === "3d" && (
              <SceneBoundary onFail={() => setSceneFailed(true)}>
                <div className="absolute inset-0">
                  <ExperienceScene motion={motionRef} />
                </div>
              </SceneBoundary>
            )}

            {/* Film grain over the scene, matching the homepage hero. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[5] opacity-[0.05]"
              style={{
                backgroundImage: GRAIN_URL,
                backgroundSize: "160px 160px",
              }}
            />

            {/* Cinematic floor into the page background. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a]/85 to-transparent" />

            <div
              ref={heroRef}
              className="absolute inset-x-0 top-[54%] z-10 -translate-y-1/2 px-6 text-center"
            >
              <HeroCopy />
            </div>

            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center"
            >
              <span className="eyebrow text-xs uppercase text-[#c9a44c]">
                Scroll to explore
              </span>
            </div>

            {STEPS.map((card, i) => (
              <div
                key={card.step}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`pointer-events-none absolute z-10 w-72 rounded-2xl border border-white/10 bg-[#141412]/75 p-6 opacity-0 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-md ${card.className}`}
              >
                <p className="text-4xl font-light text-[#c9a44c]/70">
                  {card.step}
                </p>
                <h3 className="mt-3 text-lg font-medium" style={{ color: INK }}>
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#f2f0ea]/55">{card.text}</p>
              </div>
            ))}

            <div
              ref={planRef}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(88vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#141412]/85 p-6 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md"
            >
              <p className="eyebrow text-[11px] uppercase text-[#c9a44c]">
                Residence 20B — Floor Plan
              </p>
              <FloorPlanSvg className="mt-4 w-full" />
              <p className="mt-3 text-sm text-[#f2f0ea]/55">
                Interactive in the live twin — measured to the final detail.
              </p>
            </div>

            <div
              ref={finalRef}
              className="absolute inset-0 z-20 opacity-0"
              style={{ pointerEvents: "none" }}
            >
              <Image
                src="/images/entry-05-interior.jpg"
                alt="Inside the finished residence"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-16 px-6 text-center">
                <p className="eyebrow text-xs uppercase text-[#c9a44c]">
                  The Visualization
                </p>
                <p className="mx-auto mt-3 max-w-xl text-4xl font-light tracking-tight text-[#f2f0ea] md:text-5xl">
                  Step inside — before it&apos;s built.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / no-WebGL fallback: same design language, static hero. */
        <div className="relative h-screen w-full overflow-hidden">
          <Image
            src="/images/hero-tower-sunset.jpg"
            alt="The tower at dusk"
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/45 to-transparent" />
          <div className="absolute inset-x-0 top-[52%] -translate-y-1/2 px-6 text-center">
            <HeroCopy />
          </div>
        </div>
      )}

      <section id="experience-end" className="px-6 py-28 text-center">
        <p className="eyebrow text-xs uppercase text-[#c9a44c]">VirtuEaze</p>
        <h2
          className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl"
          style={{ color: INK }}
        >
          Walk the twin yourself.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#f2f0ea]/60">
          Bring this experience to your next launch — from drawings to a live,
          explorable digital twin.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            whileHover={{ y: -2 }}
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: GOLD_INK }}
          >
            Book Demo
          </motion.a>
          <motion.span whileHover={{ y: -2 }} className="inline-block">
            <Link
              href="/"
              className="inline-block rounded-full border border-[#f2f0ea]/30 px-8 py-3 text-sm font-medium transition-colors hover:border-[#c9a44c]"
              style={{ color: INK }}
            >
              Back to Home
            </Link>
          </motion.span>
        </div>
      </section>
    </div>
  );
}
