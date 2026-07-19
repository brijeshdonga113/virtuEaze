"use client";

import { useEffect, useRef } from "react";

// Same inertial chase as the entry sequence, so the video scrub glides.
const SMOOTHING = 6;

type Source = { src: string; type: string };

/**
 * Scroll-scrubbed video: the section pins for `lengthVh` of scroll while the
 * video's playhead follows the smoothed scroll progress — Higgsfield-style
 * motion control. Reduced-motion users get a plain autoplaying loop instead.
 */
export default function ScrollVideo({
  sources,
  poster,
  eyebrow,
  line,
  lengthVh = 300,
}: {
  sources: Source[];
  poster?: string;
  eyebrow?: string;
  line?: string;
  lengthVh?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    let raf: number;
    let smooth: number | null = null;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const section = sectionRef.current;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!section || !video.duration) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const target =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      if (smooth === null) {
        smooth = target;
      } else {
        smooth += (target - smooth) * (1 - Math.exp(-dt * SMOOTHING));
        if (Math.abs(target - smooth) < 0.0004) smooth = target;
      }

      const t = smooth * Math.max(video.duration - 0.05, 0);
      if (Math.abs(video.currentTime - t) > 0.004) {
        video.currentTime = t;
      }

      if (captionRef.current) {
        const fin = Math.min(Math.max((smooth - 0.04) / 0.12, 0), 1);
        const fout = 1 - Math.min(Math.max((smooth - 0.82) / 0.12, 0), 1);
        captionRef.current.style.opacity = String(Math.min(fin, fout));
        captionRef.current.style.transform = `translateY(${(1 - fin) * 18}px)`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${lengthVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>

        <div className="hero-scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[24rem]" />

        {(eyebrow || line) && (
          <div
            ref={captionRef}
            className="pointer-events-none absolute inset-x-0 bottom-20 px-6 opacity-0 lg:px-12"
          >
            <div className="mx-auto max-w-7xl">
              {eyebrow && (
                <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                  <span className="h-px w-8 bg-accent/60" />
                  {eyebrow}
                </span>
              )}
              {line && (
                <p className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-[#f2f0ea] [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_2px_30px_rgba(0,0,0,0.45)] sm:text-5xl">
                  {line}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
