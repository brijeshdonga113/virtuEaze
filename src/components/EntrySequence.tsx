"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

type Frame = {
  // Default (dark / sunset-night) image.
  src: string;
  // Optional day-lit variant, shown in light mode. Falls back to `src`.
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
    daySrc: "/images/entry-01-skyline-day.jpg",
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

// The skyline (frame 0) is the hero backdrop. It holds still for this slice
// of the scroll while the intro reads, then the chapters begin directly — no
// captionless zoom of the skyline in between.
const HERO_HOLD = 0.12;
// Chapters are every frame after the cover; each gets its own zoom segment.
const CHAPTERS = frames.length - 1;
// How far each picture zooms in over its segment (same feel as the homepage
// hero). At the peak the next picture takes over at scale 1 and keeps going —
// one continuous dive, and only ever one image visible.
const MAX_SCALE = 2.1;

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
    const tick = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress =
          total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

        // Progress within the chapter sequence, after the hero hold.
        const seq = Math.min(
          Math.max((progress - HERO_HOLD) / (1 - HERO_HOLD), 0),
          1,
        );
        const inSequence = progress >= HERO_HOLD;
        const position = seq * CHAPTERS;
        const activeChapter = Math.min(Math.floor(position), CHAPTERS - 1);
        const local = position - activeChapter;

        frameRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            // Skyline stays as the still hero backdrop underneath everything.
            el.style.opacity = "1";
            el.style.zIndex = "0";
            el.style.transform = "scale(1)";
            return;
          }
          // Exactly one chapter is visible at a time — a hard swap at each
          // zoom peak, never a cross-fade of two images.
          const chapter = i - 1;
          if (inSequence && chapter === activeChapter) {
            const peak = frames[i].zoom ?? MAX_SCALE;
            el.style.opacity = "1";
            el.style.zIndex = "1";
            el.style.transform = `scale(${1 + local * (peak - 1)})`;
          } else {
            el.style.opacity = "0";
            el.style.zIndex = "0";
            el.style.transform = "scale(1)";
          }
        });

        // Each chapter caption eases in as its frame settles and drifts out
        // just before the swap, so only one line is ever reading at a time.
        captionRefs.current.forEach((el, i) => {
          if (!el) return;
          const chapter = i - 1;
          if (inSequence && chapter === activeChapter) {
            const fin = smoothstep(0.1, 0.34, local);
            const fout = 1 - smoothstep(0.72, 0.95, local);
            const o = Math.min(fin, fout);
            el.style.opacity = String(o);
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
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={theme === "light" && frame.daySrc ? frame.daySrc : frame.src}
              alt={frame.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Legibility scrims for the header and captions. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[32rem] bg-gradient-to-t from-background via-background/85 to-transparent" />

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
            <span className="eyebrow text-xs uppercase text-accent">
              Digital Twin Platform
            </span>
            <h1 className="mt-4 max-w-lg text-4xl font-bold tracking-tight sm:text-5xl">
              Walk into the tower before it&apos;s built.
            </h1>
            <p className="mt-6 max-w-md text-foreground/70">
              Scroll to fly from the skyline into the penthouse — VirtuEaze
              turns drawings into a single continuous digital twin, from the
              rooftop down to the floor plan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Book a Demo
              </a>
              <Link
                href="/projects"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:border-accent"
              >
                View Projects
              </Link>
            </div>
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
