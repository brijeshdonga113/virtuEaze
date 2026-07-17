"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

const frames = [
  { src: "/images/hero-tower-sunset.jpg", alt: "Skyline view of the tower at sunset" },
  { src: "/images/entry-02-approach.jpg", alt: "Approaching the tower's crown" },
  { src: "/images/entry-03-rooftop.jpg", alt: "Rooftop of the tower" },
  { src: "/images/entry-04-cutaway.jpg", alt: "Cutaway view revealing the penthouse interior" },
  { src: "/images/entry-05-interior.jpg", alt: "Inside the penthouse living room" },
  { src: "/images/entry-06-floorplan.jpg", alt: "Penthouse floor plan" },
];

const SEGMENTS = frames.length - 1;
// How far each picture zooms in over its scroll segment (same feel as the
// homepage hero). At the peak the next picture takes over at scale 1 and
// keeps going — one continuous dive, and only ever one image visible.
const MAX_SCALE = 2.1;

export default function EntrySequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
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

        const position = progress * SEGMENTS;
        // Which picture is on screen, and how far through its own zoom.
        const active = Math.min(Math.floor(position), SEGMENTS - 1);
        const local = position - active;

        frameRefs.current.forEach((el, i) => {
          if (!el) return;
          // Exactly one frame is visible at a time — a hard swap at each
          // zoom peak, never a cross-fade of two images.
          if (i === active) {
            el.style.opacity = "1";
            el.style.zIndex = "1";
            el.style.transform = `scale(${1 + local * (MAX_SCALE - 1)})`;
          } else {
            el.style.opacity = "0";
            el.style.zIndex = "0";
            el.style.transform = "scale(1)";
          }
        });

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
              src={frame.src}
              alt={frame.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Legibility scrims for the header and intro text. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-96 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div
          className={`absolute inset-x-0 bottom-24 z-10 px-6 transition-opacity duration-500 sm:bottom-28 lg:px-12 ${
            started ? "opacity-0" : "opacity-100"
          }`}
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

        <div className="pointer-events-none absolute inset-x-0 top-20 z-10 px-6 text-center sm:top-28 lg:px-12">
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
