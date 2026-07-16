"use client";

import Image from "next/image";
import FadeIn from "@/components/v2/FadeIn";
import Magnet from "@/components/v2/Magnet";
import { ContactButton } from "@/components/v2/Buttons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "/contact" },
];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: "clip" }}>
      <FadeIn y={-20} delay={0}>
        <nav className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn y={40} delay={0.15}>
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]">
            VirtuEaze
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn y={20} delay={0.35}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a digital twin studio crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn y={20} delay={0.5}>
          <ContactButton />
        </FadeIn>
      </div>

      <FadeIn
        y={30}
        delay={0.6}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <div className="relative aspect-[16/10] w-[280px] overflow-hidden rounded-t-[40px] border border-[#D7E2EA]/20 sm:w-[360px] md:w-[440px] lg:w-[520px]">
            <Image
              src="/images/twin-seq/frame_0040.jpg"
              alt="The Tremont digital twin at dusk"
              fill
              priority
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 440px, (min-width: 640px) 360px, 280px"
              className="object-cover"
            />
          </div>
        </Magnet>
      </FadeIn>
    </section>
  );
}
