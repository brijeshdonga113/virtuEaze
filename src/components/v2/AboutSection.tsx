"use client";

import Image from "next/image";
import FadeIn from "@/components/v2/FadeIn";
import AnimatedText from "@/components/v2/AnimatedText";
import { ContactButton } from "@/components/v2/Buttons";

// Corner accents cut from the demo film's four signature chapters.
const corners = [
  {
    src: "/images/twin-seq/frame_0012.jpg",
    className: "left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]",
    delay: 0.1,
    x: -80,
  },
  {
    src: "/images/twin-seq/frame_0060.jpg",
    className: "bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]",
    delay: 0.25,
    x: -80,
  },
  {
    src: "/images/twin-seq/frame_0040.jpg",
    className: "right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]",
    delay: 0.15,
    x: 80,
  },
  {
    src: "/images/twin-seq/frame_0120.jpg",
    className: "bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]",
    delay: 0.3,
    x: 80,
  },
];

const aboutText =
  "We create fully interactive 3D digital twins, focusing on exteriors, interiors, and buyer experience. We truly enjoy working with developers that aim to stand out and present their best image. Let's build something incredible together!";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-5 py-20 sm:gap-14 sm:px-8 md:gap-16 md:px-10"
    >
      {corners.map((corner) => (
        <FadeIn
          key={corner.src}
          delay={corner.delay}
          x={corner.x}
          y={0}
          duration={0.9}
          className={`absolute ${corner.className}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl opacity-80">
            <Image
              src={corner.src}
              alt=""
              aria-hidden
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
        </FadeIn>
      ))}

      <FadeIn y={40} delay={0}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          About us
        </h2>
      </FadeIn>

      <AnimatedText
        text={aboutText}
        className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
      />

      <div className="mt-6 sm:mt-10 md:mt-14">
        <ContactButton />
      </div>
    </section>
  );
}
