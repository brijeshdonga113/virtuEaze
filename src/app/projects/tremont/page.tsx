import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TwinShowcase from "@/components/TwinShowcase";
import FadeIn from "@/components/v2/FadeIn";

export const metadata: Metadata = {
  title: "Tremont — VirtuEaze",
  description:
    "Explore the Tremont digital twin — exterior, day & night, floors, x-ray view, locality and amenities.",
};

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

const highlights = [
  { label: "Location", value: "Gota, Ahmedabad" },
  { label: "Status", value: "Live Demo" },
  { label: "Explore", value: "Exterior · Interiors · Amenities" },
];

export default function TremontPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-2 pt-32 sm:pt-40 lg:px-12">
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All projects
          </Link>
          <span className="eyebrow mt-8 block text-xs uppercase text-accent">
            Live Demo · Tremont
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Explore the Tremont digital twin.
          </h1>
          <p className="mt-6 max-w-xl text-foreground/60">
            Scroll through the film below — exterior, day &amp; night, floor
            selection, x-ray view, locality and amenities, all in one
            continuous take.
          </p>

          <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.label}>
                <dt className="eyebrow text-[11px] uppercase text-foreground/40">
                  {h.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{h.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>

      <TwinShowcase />

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-12">
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Want this for your project?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-foreground/60">
              We turn your drawings into a live, explorable digital twin like
              Tremont.
            </p>
          </FadeIn>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Book a Demo
            </a>
            <Link
              href="/projects"
              className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:border-accent"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
