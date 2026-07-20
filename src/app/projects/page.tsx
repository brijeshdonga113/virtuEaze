import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MediaSlot from "@/components/MediaSlot";
import TwinShowcase from "@/components/TwinShowcase";
import FadeIn from "@/components/v2/FadeIn";

export const metadata: Metadata = {
  title: "Projects — VirtuEaze",
  description: "Projects available to explore as interactive digital twins.",
};

const projects = [
  {
    slug: "tremont",
    name: "Tremont",
    location: "Gota, Ahmedabad",
    status: "Live Demo",
    src: "/images/twin-seq/frame_0012.jpg",
  },
  {
    slug: "north-wind-sanctuary",
    name: "North Wind Sanctuary",
    location: "Ahmedabad, Gujarat",
    status: "Case Study",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:pt-40 lg:px-12">
        <FadeIn>
          <span className="eyebrow text-xs uppercase text-accent">Projects</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Every project, walkable before it&apos;s built.
          </h1>
          <p className="mt-6 max-w-xl text-foreground/60">
            Each listing below opens as a full digital twin — floor plans, unit
            interiors, amenities, and the surrounding locality.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={i * 0.1}>
              <a
                href={`#${project.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border p-3 transition-colors hover:border-accent/50 hover:bg-white/[0.02]"
              >
                <MediaSlot
                  step={project.status}
                  label="Render coming soon"
                  src={project.src}
                  alt={project.name}
                  className="aspect-[4/3] w-full overflow-hidden rounded-xl"
                />
                <div className="flex items-start justify-between gap-3 px-1 pb-1">
                  <div>
                    <h2 className="text-lg font-medium">{project.name}</h2>
                    <p className="mt-1 text-sm text-foreground/60">
                      {project.location}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>

      <div id="tremont" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl border-t border-border px-6 pb-2 pt-20 sm:pt-24 lg:px-12">
          <FadeIn>
            <span className="eyebrow text-xs uppercase text-accent">
              Live Demo · Tremont
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore the Tremont digital twin.
            </h2>
            <p className="mt-4 max-w-xl text-foreground/60">
              Scroll through the film below — exterior, day &amp; night, floor
              selection, x-ray view, locality and amenities, all in one
              continuous take.
            </p>
          </FadeIn>
        </div>
        <TwinShowcase />
      </div>

      <div
        id="north-wind-sanctuary"
        className="mx-auto max-w-7xl scroll-mt-32 border-t border-border px-6 py-20 sm:py-24 lg:px-12"
      >
        <FadeIn>
          <span className="eyebrow text-xs uppercase text-accent">
            Case Study
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            North Wind Sanctuary
          </h2>
          <p className="mt-2 text-foreground/60">Ahmedabad, Gujarat</p>
          <p className="mt-6 max-w-xl text-foreground/50">
            Interactive digital twin walkthrough coming soon.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-accent"
          >
            Request early access
            <ArrowUpRight className="size-4" />
          </Link>
        </FadeIn>
      </div>
    </>
  );
}
