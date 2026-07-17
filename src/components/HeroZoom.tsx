"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

        {/* Subtle scrims so the transparent header and scroll cue stay legible. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-10 px-6 text-center sm:bottom-14">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to zoom in
          </span>
        </div>

        <h1 className="sr-only">
          Sell your property before you build it — VirtuEaze interactive 3D
          digital twins
        </h1>
      </div>
    </section>
  );
}
