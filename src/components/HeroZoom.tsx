"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

const MAX_SCALE = 2.1;
// Roughly where the tower sits in the source photo, used as the zoom's
// transform-origin so scaling reads as "diving into the building" rather
// than just enlarging the whole frame.
const FOCUS_X = "64%";
const FOCUS_Y = "50%";

export default function HeroZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (section && image) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress =
          total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

        const scale = 1 + progress * (MAX_SCALE - 1);
        image.style.transform = `scale(${scale})`;

        setStarted((prev) => prev || progress > 0.02);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[250vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: `${FOCUS_X} ${FOCUS_Y}` }}
        >
          <Image
            src="/images/hero-tower-sunset.jpg"
            alt="Luxury glass tower at sunset overlooking the city skyline"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Subtle scrims so the transparent header and intro text stay legible. */}
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
              See every tower before it&apos;s built.
            </h1>
            <p className="mt-6 max-w-md text-foreground/70">
              VirtuEaze turns drawings into a fully interactive 3D digital
              twin — buyers explore the exterior, the interiors, and the
              neighbourhood before a single brick is laid.
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

        <div className="pointer-events-none absolute inset-x-0 bottom-8 px-6 text-center">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to zoom in
          </span>
        </div>
      </div>
    </section>
  );
}
