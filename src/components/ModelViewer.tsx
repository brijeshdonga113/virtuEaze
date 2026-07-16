"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Floating data chips at different depths — their parallax against the
// render is what makes the scene read as a model instead of a photo.
// Figures from the Tremont demo film (floor selector + x-ray chapters).
const chips = [
  { label: "G+33", sub: "Floors", x: "18%", y: "18%", z: 90 },
  { label: "17", sub: "Varieties / Floor", x: "68%", y: "12%", z: 70 },
  { label: "Day & Night", sub: "Live Lighting", x: "76%", y: "62%", z: 110 },
  { label: "X-Ray", sub: "Floor View", x: "10%", y: "66%", z: 60 },
];

export default function ModelViewer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const target = useRef({ rx: 0, ry: 0 });
  const current = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number;
    const tick = () => {
      // Ease toward the pointer-driven target so motion feels weighted.
      current.current.rx += (target.current.rx - current.current.rx) * 0.08;
      current.current.ry += (target.current.ry - current.current.ry) * 0.08;
      const { rx, ry } = current.current;
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      if (shineRef.current) {
        shineRef.current.style.transform = `translateX(${ry * 14}px) translateY(${-rx * 14}px) translateZ(1px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointer = (e: React.PointerEvent) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    target.current = { rx: -ny * 14, ry: nx * 18 };
  };

  const resetPointer = () => {
    target.current = { rx: 0, ry: 0 };
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <span className="eyebrow text-xs uppercase text-accent">The Model</span>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Hold the tower in your hands.
        </h2>
        <p className="mt-6 max-w-xl text-foreground/60">
          Move your cursor — or your thumb — and the twin responds in real
          time, the way it does in our showroom.
        </p>

        <div
          ref={stageRef}
          onPointerMove={handlePointer}
          onPointerLeave={resetPointer}
          className="relative mt-16 flex justify-center [touch-action:pan-y]"
          style={{ perspective: "1400px" }}
        >
          {/* Ambient glow sampled from the dusk render so the card sits in its own light. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-16 bg-[radial-gradient(ellipse_at_center,rgba(135,104,128,0.22),rgba(83,66,85,0.10)_45%,transparent_70%)]"
          />
          <div
            ref={cardRef}
            className="relative w-full max-w-3xl will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Depth backdrop — lags behind the main plane. */}
            <div
              className="absolute inset-0 overflow-hidden rounded-3xl opacity-40 blur-lg"
              style={{ transform: "translateZ(-70px) scale(1.08)" }}
            >
              <Image
                src="/images/twin-seq/frame_0040.jpg"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
            </div>

            {/* Main render plane. */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/twin-seq/frame_0040.jpg"
                alt="The Tremont tower digital twin at dusk, tilting in 3D as the pointer moves"
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
              {/* Specular sheen that tracks the pointer. */}
              <div
                ref={shineRef}
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(242,240,234,0.14),transparent_55%)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>

            {/* Floating data chips at raised depths. */}
            {chips.map((chip) => (
              <div
                key={chip.label}
                className="pointer-events-none absolute hidden sm:block"
                style={{
                  left: chip.x,
                  top: chip.y,
                  transform: `translateZ(${chip.z}px)`,
                }}
              >
                <div className="rounded-full border border-accent/40 bg-black/70 px-4 py-1.5 backdrop-blur-md">
                  <p className="text-sm font-medium leading-tight">
                    {chip.label}
                  </p>
                  <p className="eyebrow text-[9px] uppercase text-accent">
                    {chip.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Ground reflection. */}
            <div
              aria-hidden
              className="absolute inset-x-8 top-full h-24 origin-top overflow-hidden rounded-3xl opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
              style={{ transform: "scaleY(-1) translateZ(-20px)" }}
            >
              <Image
                src="/images/twin-seq/frame_0040.jpg"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </div>

        <p className="eyebrow mt-20 text-center text-[10px] uppercase text-foreground/40 sm:mt-24">
          Move to explore · Live tilt · Depth-mapped chips
        </p>
      </div>
    </section>
  );
}
