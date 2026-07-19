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
import { motion } from "framer-motion";
import FloorPlanSvg from "@/components/FloorPlanSvg";
import FadeIn from "@/components/v2/FadeIn";
import AnimatedText from "@/components/v2/AnimatedText";
import TrustBento from "@/components/TrustBento";
import ScrollVideo from "@/components/ScrollVideo";
import type { MotionState } from "@/components/experience/ExperienceScene";

const ExperienceScene = dynamic(
  () => import("@/components/experience/ExperienceScene"),
  { ssr: false },
);

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

// Homepage palette — the experience shares the site's dark luxury brand.
const BG = "#0a0a0a";
const INK = "#f2f0ea";

// Same film grain as the homepage hero.
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SMOOTHING = 6;
const SCROLL_LENGTH_VH = 640;

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

/** Hero block in the homepage's exact layout: left-aligned, gold eyebrow,
    bold tracking-tight headline, gold + outline pill CTAs. */
function HeroCopy() {
  return (
    <div className="mx-auto max-w-7xl text-left">
      <span className="eyebrow text-xs uppercase text-[#c9a44c]">
        Interactive Real Estate
      </span>
      <h1
        className="mt-4 max-w-lg text-4xl font-bold tracking-tight sm:text-5xl"
        style={{ color: INK }}
      >
        Experience tomorrow&apos;s homes today.
      </h1>
      <p className="mt-6 max-w-md text-[#f2f0ea]/70">
        Transform blueprints into immersive digital experiences that help
        buyers explore, understand and purchase with confidence.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <motion.a
          whileHover={{ y: -2 }}
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Book a Demo
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
    </div>
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

const pillars = [
  {
    title: "Clear Understanding",
    text: "Buyers see everything. No imagination needed.",
  },
  {
    title: "Clear Confidence",
    text: "Every space, amenity and view is fully explorable.",
  },
  {
    title: "Clear Decisions",
    text: "When buyers understand the project, they decide faster.",
  },
];

const features = [
  { title: "Full Exterior View", text: "See the complete building from every angle." },
  {
    title: "Nearby Connectivity",
    text: "Metro, roads, malls, schools all mapped for instant clarity.",
  },
  { title: "Day & Night Mode", text: "Realistic lighting, sunrise/sunset, shadow movement." },
  {
    title: "Amenities Access",
    text: "Foyer, lift, parking, clubhouse — explore all shared spaces.",
  },
  {
    title: "Complete Interior Walkthrough",
    text: "Move room to room, open the balcony, feel the real space.",
  },
  {
    title: "Unit Comparison + Status",
    text: "Compare layouts & check availability (optional feature).",
  },
];

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
              className="absolute inset-x-0 bottom-24 z-10 px-6 sm:bottom-28 lg:px-12"
            >
              <HeroCopy />
            </div>

            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 top-20 z-10 px-6 text-center sm:top-28"
            >
              <span className="eyebrow text-xs uppercase text-[#c9a44c]">
                Scroll to explore the building
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
          <div className="absolute inset-x-0 bottom-24 px-6 sm:bottom-28 lg:px-12">
            <HeroCopy />
          </div>
        </div>
      )}

      {/* TEMP scroll-scrubbed video preview — the clip's playhead follows the
          scroll (like the building zoom), so frames change as you scroll.
          Replace public/videos/showcase-temp.mp4 with the real render later
          (this stand-in is a competitor showcase, not for ship). */}
      <ScrollVideo
        sources={[{ src: "/videos/showcase-temp.mp4", type: "video/mp4" }]}
        poster="/images/hero-tower-sunset.jpg"
        eyebrow="Cinematic Walkthrough"
        line="See the twin in motion."
        lengthVh={320}
      />

      {/* Below-the-fold content in the homepage's exact styling. */}
      <div id="experience-end" className="bg-background text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-12">
            <FadeIn>
              <span className="eyebrow text-xs uppercase text-accent">
                Why VirtuEaze
              </span>
            </FadeIn>
            <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3">
              {pillars.map((pillar, i) => (
                <FadeIn
                  key={pillar.title}
                  delay={i * 0.1}
                  className="border-t border-border pt-6"
                >
                  <h2 className="text-lg font-medium">{pillar.title}</h2>
                  <p className="mt-2 text-sm text-foreground/60">
                    {pillar.text}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <TrustBento />

        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <FadeIn>
              <span className="eyebrow text-xs uppercase text-accent">
                Inside the Twin
              </span>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Everything a buyer wants to know, one tap away.
              </h2>
            </FadeIn>
            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <FadeIn
                  key={feature.title}
                  delay={(i % 3) * 0.1}
                  className="border-t border-border pt-6"
                >
                  <p className="eyebrow text-xs uppercase text-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm text-foreground/60">
                    {feature.text}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12">
            <AnimatedText
              text="“VirtuEaze helped us explain the project clearly. Buyers understood the layout, views and amenities in the first meeting.”"
              className="text-2xl font-light leading-relaxed text-foreground/90 sm:text-3xl"
            />
            <FadeIn>
              <p className="eyebrow mt-8 text-xs uppercase text-accent">
                Senior Sales Executive
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-24 lg:flex-row lg:items-center lg:px-12">
            <FadeIn>
              <span className="eyebrow text-xs uppercase text-accent">
                Featured Projects
              </span>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight">
                See the twin behind the tower.
              </h2>
            </FadeIn>
            <Link
              href="/projects"
              className="whitespace-nowrap rounded-full border border-border px-7 py-3 text-sm font-medium transition-colors hover:border-accent"
            >
              View All Projects
            </Link>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-12">
            <FadeIn>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Want to increase conversion?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-foreground/60">
                Sell your property before you build it — bring VirtuEaze into
                your next launch.
              </p>
            </FadeIn>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Book a Demo
              </a>
              <Link
                href="/"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:border-accent"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
