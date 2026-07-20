"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { LiveProjectButton } from "@/components/v2/Buttons";

const frameAt = (n: number) => `/images/twin-seq/frame_${String(n).padStart(4, "0")}.jpg`;

// Three chapters of the Tremont demo film, presented as project case cards.
const projects = [
  {
    number: "01",
    category: "Exterior & Lighting",
    name: "Tremont — The Tower",
    href: "/projects/tremont",
    col1: [frameAt(12), frameAt(30)],
    col2: frameAt(40),
  },
  {
    number: "02",
    category: "Floors & Units",
    name: "Tremont — X-Ray View",
    href: "/projects/tremont",
    col1: [frameAt(60), frameAt(75)],
    col2: frameAt(90),
  },
  {
    number: "03",
    category: "Context & Amenities",
    name: "Tremont — The Locality",
    href: "/projects/tremont",
    col1: [frameAt(120), frameAt(135)],
    col2: frameAt(150),
  },
];

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="h-[85vh]">
      <motion.div
        style={{ scale, top: `${index * 28}px` }}
        className="sticky top-24 rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:top-32 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 px-2 pb-6 sm:px-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <span
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {project.number}
            </span>
            <div>
              <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                {project.category}
              </p>
              <h3
                className="mt-1 font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.href} />
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <div
              className="relative overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            >
              <Image
                src={project.col1[0]}
                alt={`${project.name} — view 1`}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
            <div
              className="relative overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            >
              <Image
                src={project.col1[1]}
                alt={`${project.name} — view 2`}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="relative w-[60%] overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px]">
            <Image
              src={project.col2}
              alt={`${project.name} — view 3`}
              fill
              sizes="60vw"
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28"
    >
      <h2
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Project
      </h2>

      <div ref={containerRef} className="mx-auto mt-16 max-w-6xl sm:mt-20">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
