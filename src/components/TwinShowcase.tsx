"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const FRAME_COUNT = 160;

// Chapter targets follow the demo film's own baked-in title cards, so the
// pills land where each chapter begins in the footage.
const chapters = [
  { id: "exterior", label: "Exterior", target: 0 },
  { id: "day-night", label: "Day & Night", target: 0.18 },
  { id: "floors", label: "Floors", target: 0.37 },
  { id: "xray", label: "X-Ray View", target: 0.56 },
  { id: "locality", label: "Locality", target: 0.75 },
  { id: "amenities", label: "Amenities", target: 0.93 },
];

export default function TwinShowcase() {
  const frames = useMemo(
    () =>
      Array.from(
        { length: FRAME_COUNT },
        (_, i) => `/images/twin-seq/frame_${String(i + 1).padStart(4, "0")}.jpg`,
      ),
    [],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadBarRef = useRef<HTMLDivElement>(null);
  const lastDrawn = useRef(-1);
  const [activeChapter, setActiveChapter] = useState(0);
  const [started, setStarted] = useState(false);
  const { images, progress: loadProgress } = useImagePreloader(frames);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const nearestLoaded = (i: number) => {
      for (let j = i; j >= 0; j--) if (images.current[j]) return j;
      for (let j = i + 1; j < frames.length; j++) if (images.current[j]) return j;
      return -1;
    };

    const draw = (index: number) => {
      const j = nearestLoaded(index);
      if (j < 0 || j === lastDrawn.current) return;
      const img = images.current[j]!;
      // Landscape viewports fill the screen; portrait phones letterbox the
      // wide footage instead of cropping to a thin slice.
      const cover = canvas.width / canvas.height >= 1;
      const scale = (cover ? Math.max : Math.min)(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      lastDrawn.current = j;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      lastDrawn.current = -1;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf: number;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

        draw(Math.min(frames.length - 1, Math.floor(progress * frames.length)));

        setStarted((prev) => prev || progress > 0.02);
        let chapterIndex = 0;
        for (let i = 0; i < chapters.length; i++) {
          if (progress >= chapters[i].target - 0.04) chapterIndex = i;
        }
        setActiveChapter((prev) => (prev !== chapterIndex ? chapterIndex : prev));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [frames, images]);

  useEffect(() => {
    if (loadBarRef.current) {
      loadBarRef.current.style.transform = `scaleX(${loadProgress})`;
      loadBarRef.current.style.opacity = loadProgress >= 1 ? "0" : "1";
    }
  }, [loadProgress]);

  const goTo = (target: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top =
      window.scrollY + rect.top + target * (rect.height - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      role="img"
      aria-label="Scroll-driven film of the Tremont digital twin: exterior, day and night cycle, floor selection, x-ray floor view, locality, and amenities"
      className="relative h-[400vh] md:h-[600vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <canvas ref={canvasRef} className="h-full w-full" />

        {/* Legibility scrims for the fixed site header and bottom pills. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent sm:h-32" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent sm:h-32" />

        {/* Viewport corner brackets. */}
        <div className="pointer-events-none absolute left-5 top-24 h-6 w-6 border-l border-t border-accent/50 sm:left-8" />
        <div className="pointer-events-none absolute right-5 top-24 h-6 w-6 border-r border-t border-accent/50 sm:right-8" />
        <div className="pointer-events-none absolute bottom-6 left-5 h-6 w-6 border-b border-l border-accent/50 sm:left-8" />
        <div className="pointer-events-none absolute bottom-6 right-5 h-6 w-6 border-b border-r border-accent/50 sm:right-8" />

        {/* Live badge. */}
        <div className="pointer-events-none absolute left-8 top-28 hidden items-center gap-2 rounded-full border border-border bg-black/50 px-4 py-1.5 backdrop-blur-md sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="eyebrow text-[10px] uppercase text-white/80">
            Live · Digital Twin
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-20 px-6 text-center sm:top-28 lg:px-12">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to explore the digital twin
          </span>
        </div>

        {/* Sequence loading hairline. */}
        <div
          ref={loadBarRef}
          className="absolute bottom-6 left-1/2 h-px w-40 origin-left -translate-x-1/2 bg-accent transition-opacity duration-500"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Chapter pills mirroring the film's sections. */}
        <div className="absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-border bg-black/60 p-1.5 backdrop-blur-md">
            {chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => goTo(chapter.target)}
                aria-current={activeChapter === i ? "true" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                  activeChapter === i
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {activeChapter === i && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
                )}
                {chapter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
