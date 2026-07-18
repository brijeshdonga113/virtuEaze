"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import Magnet from "@/components/v2/Magnet";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

// Luxury-editorial entrance ease (fast out, long settle).
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

// Monochrome film grain, tiled; kept below the scrims so text stays clean.
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Word-by-word masked rise for the hero headline. */
function MaskedWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <h1 className={className} aria-label={text}>
      {text.split(" ").map((word, i, words) => (
        <Fragment key={i}>
          <span
            aria-hidden
            className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.9,
                delay: delay + i * 0.055,
                ease: REVEAL_EASE,
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}

type Frame = {
  // Default (dark / sunset-night) image.
  src: string;
  // Day-lit variant, cross-faded in while the light theme is active.
  daySrc?: string;
  alt: string;
  // The first frame is the cover (hero intro), so it carries no chapter.
  chapter?: string;
  line?: string;
  // Per-frame peak zoom; defaults to MAX_SCALE. The floor plan is a diagram,
  // so it only nudges in to keep its edge labels on screen.
  zoom?: number;
};

const frames: Frame[] = [
  {
    src: "/images/hero-tower-sunset.jpg",
    daySrc: "/images/hero-tower-day.jpg",
    alt: "Skyline view of the tower at sunset",
  },
  {
    src: "/images/entry-02-approach.jpg",
    daySrc: "/images/entry-02-approach-day.jpg",
    alt: "Approaching the tower's crown",
    chapter: "01 — Ascent",
    line: "Rising to meet the light.",
  },
  {
    src: "/images/entry-03-rooftop.jpg",
    daySrc: "/images/entry-03-rooftop-day.jpg",
    alt: "Rooftop of the tower",
    chapter: "02 — The Crown",
    line: "The city, laid at your feet.",
  },
  {
    src: "/images/entry-04-cutaway.jpg",
    daySrc: "/images/entry-04-cutaway-day.jpg",
    alt: "Cutaway view revealing the penthouse interior",
    chapter: "03 — The Reveal",
    line: "Every room, opened to view.",
  },
  {
    src: "/images/entry-05-interior.jpg",
    daySrc: "/images/entry-05-interior-day.jpg",
    alt: "Inside the penthouse living room",
    chapter: "04 — The Interior",
    line: "Step into a space not yet built.",
  },
  {
    src: "/images/entry-06-floorplan.jpg",
    alt: "Penthouse floor plan",
    chapter: "05 — The Blueprint",
    line: "Measured to the final detail.",
    zoom: 1.08,
  },
];

// The skyline (frame 0) is the hero backdrop. It holds this slice of the
// scroll while the intro reads — drifting in slowly — then the chapters
// dissolve in over it.
const HERO_HOLD = 0.12;
// Chapters are every frame after the cover; each gets its own zoom segment.
const CHAPTERS = frames.length - 1;
// How far each picture zooms in over its segment. Frames dissolve through
// each other at the peaks, so the dive reads as one continuous move.
const MAX_SCALE = 2.1;
// Fraction of a chapter segment over which the incoming frame dissolves in
// across the previous frame's zoom peak.
const FADE = 0.22;
// How much the skyline drifts in while the intro holds.
const HOLD_DRIFT = 0.05;
// Per-second rate for the scroll inertia; higher settles faster. This keeps
// notchy wheel input from stepping the zoom — everything glides.
const SMOOTHING = 6;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

export default function EntrySequence() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let raf: number;
    // Inertia state. Seeded from the real scroll position on the first tick
    // so a mid-page reload doesn't glide in from the top.
    let smooth: number | null = null;
    let applied = -1;
    let last = performance.now();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const target =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      // Exponential chase of the scroll position — frame-rate independent,
      // and skipped entirely for reduced-motion users.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (smooth === null || reduceMotion) {
        smooth = target;
      } else {
        smooth += (target - smooth) * (1 - Math.exp(-dt * SMOOTHING));
        if (Math.abs(target - smooth) < 0.0004) smooth = target;
      }

      const progress = smooth;
      if (Math.abs(progress - applied) < 0.00001) return;
      applied = progress;

      // Continuous chapter position; negative during the hero hold so the
      // first chapter's dissolve window can straddle the hold's end.
      const position =
        ((progress - HERO_HOLD) / (1 - HERO_HOLD)) * CHAPTERS;

      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          // Skyline backdrop: drifts in gently while the intro holds, then
          // is dissolved over by chapter 1. Dropped from compositing once
          // it's fully covered.
          const drift = 1 + HOLD_DRIFT * smoothstep(0, HERO_HOLD, progress);
          el.style.opacity = String(1 - smoothstep(0.1, 0.3, position));
          el.style.transform = `scale(${drift})`;
          return;
        }

        const chapter = i - 1;
        // Dissolve in over the tail of the previous frame's zoom …
        const fadeIn = smoothstep(chapter - FADE, chapter, position);
        // … and release once the next frame fully covers this one.
        const covered =
          chapter < CHAPTERS - 1
            ? smoothstep(chapter + 1 + 0.02, chapter + 1 + 0.12, position)
            : 0;
        // The zoom starts the moment the frame begins dissolving in, so it
        // is already moving when it lands — one continuous dive.
        const peak = frames[i].zoom ?? MAX_SCALE;
        const zoomT = Math.min(
          Math.max((position - chapter + FADE) / (1 + FADE), 0),
          1,
        );
        el.style.opacity = String(fadeIn * (1 - covered));
        el.style.transform = `scale(${1 + zoomT * (peak - 1)})`;
      });

      // Each chapter caption eases in as its frame settles and drifts out
      // just before the dissolve, so only one line is ever reading at a time.
      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const local = position - (i - 1);
        if (local > -0.5 && local < 1.5) {
          const fin = smoothstep(0.08, 0.32, local);
          const fout = 1 - smoothstep(0.72, 0.95, local);
          el.style.opacity = String(Math.min(fin, fout));
          el.style.transform = `translateY(${(1 - fin) * 18}px)`;
        } else {
          el.style.opacity = "0";
        }
      });

      // Hero intro fades out across the hold, gone by the time chapter 1 hits.
      if (heroRef.current) {
        const o = 1 - smoothstep(0.015, HERO_HOLD * 0.9, progress);
        heroRef.current.style.opacity = String(o);
        heroRef.current.style.pointerEvents = o < 0.05 ? "none" : "auto";
      }

      setStarted((prev) => prev || progress > 0.02);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isDay = theme === "light";

  return (
    <section ref={sectionRef} className="relative h-[600vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {frames.map((frame, i) => (
          <div
            key={frame.src}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i }}
          >
            {/* Night layer is the base; the day-lit variant sits above it and
                dissolves in with the light theme, so toggling the theme never
                hard-swaps an image mid-scroll. */}
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              preload={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            {frame.daySrc && (
              <Image
                src={frame.daySrc}
                alt={frame.alt}
                fill
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="100vw"
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  isDay ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>
        ))}

        {/* Film grain over the imagery, under the scrims and text. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[8] opacity-[0.05]"
          style={{ backgroundImage: GRAIN_URL, backgroundSize: "160px 160px" }}
        />

        {/* Legibility scrims for the header and captions; theme-aware so the
            light theme doesn't fog the day-lit imagery. */}
        <div className="hero-scrim-top pointer-events-none absolute inset-x-0 top-0 z-10 h-32" />
        <div className="hero-scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[32rem]" />

        {/* Per-frame chapter captions (the cover frame has none). */}
        {frames.map((frame, i) =>
          frame.chapter ? (
            <div
              key={`cap-${frame.src}`}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-x-0 bottom-24 z-20 px-6 opacity-0 sm:bottom-28 lg:px-12"
            >
              <div className="mx-auto max-w-7xl">
                <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                  <span className="h-px w-8 bg-accent/60" />
                  {frame.chapter}
                </span>
                <p className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground [text-shadow:0_2px_30px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl">
                  {frame.line}
                </p>
              </div>
            </div>
          ) : null
        )}

        <div
          ref={heroRef}
          className="absolute inset-x-0 bottom-24 z-30 px-6 sm:bottom-28 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <motion.span
              className="eyebrow inline-block text-xs uppercase text-accent"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: REVEAL_EASE }}
            >
              Digital Twin Platform
            </motion.span>
            <MaskedWords
              text="Walk into the tower before it's built."
              className="mt-4 max-w-lg text-4xl font-bold tracking-tight sm:text-5xl"
              delay={0.15}
            />
            <motion.p
              className="mt-6 max-w-md text-foreground/70"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: REVEAL_EASE }}
            >
              Scroll to fly from the skyline into the penthouse — VirtuEaze
              turns drawings into a single continuous digital twin, from the
              rooftop down to the floor plan.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: REVEAL_EASE }}
            >
              <Magnet padding={70} strength={7} className="inline-flex">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Book a Demo
                </a>
              </Magnet>
              <Magnet padding={70} strength={7} className="inline-flex">
                <Link
                  href="/projects"
                  className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:border-accent"
                >
                  View Projects
                </Link>
              </Magnet>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-20 z-30 px-6 text-center sm:top-28 lg:px-12">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to enter the building
          </span>
        </div>
      </div>
    </section>
  );
}
