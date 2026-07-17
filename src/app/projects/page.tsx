import type { Metadata } from "next";
import MediaSlot from "@/components/MediaSlot";
import TwinShowcase from "@/components/TwinShowcase";

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
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-40 lg:px-12">
        <span className="eyebrow text-xs uppercase text-accent">Projects</span>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Every project, walkable before it&apos;s built.
        </h1>
        <p className="mt-6 max-w-xl text-foreground/60">
          Each listing below opens as a full digital twin — floor plans, unit
          interiors, amenities, and the surrounding locality.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.name}
              href={`#${project.slug}`}
              className="flex flex-col gap-4"
            >
              <MediaSlot
                step={project.status}
                label="Render coming soon"
                src={project.src}
                alt={project.name}
                className="aspect-[4/3] w-full"
              />
              <div>
                <h2 className="text-lg font-medium">{project.name}</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  {project.location}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div id="tremont" className="scroll-mt-24">
        <TwinShowcase />
      </div>

      <div
        id="north-wind-sanctuary"
        className="mx-auto max-w-7xl scroll-mt-32 border-t border-border px-6 py-24 lg:px-12"
      >
        <span className="eyebrow text-xs uppercase text-accent">
          Case Study
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">
          North Wind Sanctuary
        </h2>
        <p className="mt-2 text-foreground/60">Ahmedabad, Gujarat</p>
        <p className="mt-6 max-w-xl text-foreground/50">
          Interactive digital twin walkthrough coming soon.
        </p>
      </div>
    </>
  );
}
