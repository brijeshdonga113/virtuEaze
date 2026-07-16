"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Tiles sampled across the Tremont demo film.
const frameAt = (n: number) => `/images/twin-seq/frame_${String(n).padStart(4, "0")}.jpg`;
const row1 = [1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80].map(frameAt);
const row2 = [88, 96, 104, 112, 120, 128, 136, 144, 152, 160].map(frameAt);

function Row({
  images,
  direction,
  rowRef,
}: {
  images: string[];
  direction: 1 | -1;
  rowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tripled = [...images, ...images, ...images];
  return (
    <div
      ref={rowRef}
      className="flex gap-3"
      style={{ willChange: "transform" }}
      data-direction={direction}
    >
      {tripled.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl"
        >
          <Image
            src={src}
            alt=""
            aria-hidden
            fill
            loading="lazy"
            sizes="420px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.offsetTop;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <Row images={row1} direction={1} rowRef={row1Ref} />
      <Row images={row2} direction={-1} rowRef={row2Ref} />
    </section>
  );
}
