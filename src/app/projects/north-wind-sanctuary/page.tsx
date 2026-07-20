import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/v2/FadeIn";

export const metadata: Metadata = {
  title: "North Wind Sanctuary — VirtuEaze",
  description:
    "North Wind Sanctuary, Ahmedabad — interactive digital twin walkthrough coming soon.",
};

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

export default function NorthWindSanctuaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40 lg:px-12">
      <FadeIn>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>
        <span className="eyebrow mt-8 block text-xs uppercase text-accent">
          Case Study
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          North Wind Sanctuary
        </h1>
        <p className="mt-2 text-foreground/60">Ahmedabad, Gujarat</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-12 flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-border bg-white/[0.02]">
          <div className="text-center">
            <span className="eyebrow text-xs uppercase text-accent">
              Render coming soon
            </span>
            <p className="mt-3 text-foreground/50">
              Interactive digital twin walkthrough in production.
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Request early access
        </Link>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-3 mt-10 inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium transition-colors hover:border-accent"
        >
          Book a Demo
        </a>
      </FadeIn>
    </div>
  );
}
