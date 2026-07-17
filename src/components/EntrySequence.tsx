"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

const frames = [
  { src: "/images/hero-tower-sunset.jpg", label: "Skyline" },
  { src: "/images/entry-02-approach.jpg", label: "Approach" },
  { src: "/images/entry-03-rooftop.jpg", label: "Rooftop" },
  { src: "/images/entry-04-cutaway.jpg", label: "Inside the Suite" },
  { src: "/images/entry-05-interior.jpg", label: "Living Room" },
  { src: "/images/entry-06-floorplan.jpg", label: "Floor Plan" },
];

const LAST_INDEX = frames.length - 1;

export default function EntrySequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [started, setStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress =
          total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

        const position = progress * LAST_INDEX;

        frameRefs.current.forEach((el, i) => {
          if (!el) return;
          const opacity = Math.min(Math.max(1 - Math.abs(position - i), 0), 1);
          el.style.opacity = String(opacity);
        });

        setStarted((prev) => prev || progress > 0.02);
        setActiveChapter((prev) => {
          const next = Math.min(LAST_INDEX, Math.round(position));
          return prev !== next ? next : prev;
        });
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
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={frame.src}
              alt={`VirtuEaze digital twin walkthrough: ${frame.label}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Legibility scrims for the header and chapter pills. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div
          className={`absolute inset-x-0 bottom-24 px-6 transition-opacity duration-500 sm:bottom-28 lg:px-12 ${
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

        <div className="pointer-events-none absolute inset-x-0 top-20 px-6 text-center sm:top-28 lg:px-12">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to enter the building
          </span>
        </div>

        {/* Chapter pills mirroring the sequence. */}
        <div className="absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-border bg-black/60 p-1.5 backdrop-blur-md">
            {frames.map((frame, i) => (
              <span
                key={frame.label}
                aria-current={activeChapter === i ? "true" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                  activeChapter === i
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {activeChapter === i && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
                )}
                {frame.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
