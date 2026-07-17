import Image from "next/image";
import Link from "next/link";
import ModelViewer from "@/components/ModelViewer";
import TrustBento from "@/components/TrustBento";

const pillars = [
  {
    title: "Clear Understanding",
    text: "Buyers see everything. No imagination needed.",
  },
  {
    title: "Clear Confidence",
    text: "Every space, amenity and view is fully explorable.",
  },
  {
    title: "Clear Decisions",
    text: "When buyers understand the project, they decide faster.",
  },
];

const features = [
  {
    title: "Full Exterior View",
    text: "See the complete building from every angle.",
  },
  {
    title: "Nearby Connectivity",
    text: "Metro, roads, malls, schools all mapped for instant clarity.",
  },
  {
    title: "Day & Night Mode",
    text: "Realistic lighting, sunrise/sunset, shadow movement.",
  },
  {
    title: "Amenities Access",
    text: "Foyer, lift, parking, clubhouse — explore all shared spaces.",
  },
  {
    title: "Complete Interior Walkthrough",
    text: "Move room to room, open the balcony, feel the real space.",
  },
  {
    title: "Unit Comparison + Status",
    text: "Compare layouts & check availability (optional feature).",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Share your drawings",
    text: "Plans, elevations and details.",
  },
  {
    step: "02",
    title: "We build your Digital Twin",
    text: "Modeling, lighting and interactions.",
  },
  {
    step: "03",
    title: "Go live",
    text: "Use it on mobile, desktop or VR.",
  },
];

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";
const DEMO_VIDEO_URL = "https://www.youtube.com/watch?v=8BGDAjvOqqU";

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
        <Image
          src="/images/hero-showroom.jpg"
          alt="Sales advisor presenting a digital twin of a new building on a wall touchscreen"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Subtle scrim so the transparent header stays legible over the photo. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <h1 className="sr-only">
          Sell your property before you build it — VirtuEaze interactive 3D
          digital twins
        </h1>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-12">
          <span className="eyebrow text-xs uppercase text-accent">
            Why VirtuEaze
          </span>
          <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-border pt-6">
                <h2 className="text-lg font-medium">{pillar.title}</h2>
                <p className="mt-2 text-sm text-foreground/60">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBento />

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <span className="eyebrow text-xs uppercase text-accent">
            Inside the Twin
          </span>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything a buyer wants to know, one tap away.
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={feature.title} className="border-t border-border pt-6">
                <p className="eyebrow text-xs uppercase text-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <span className="eyebrow text-xs uppercase text-accent">
            How It Works
          </span>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            From drawings to live twin.
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.step}>
                <p className="text-5xl font-light text-accent/60">
                  {step.step}
                </p>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="eyebrow mt-16 text-xs uppercase text-foreground/50">
            Perfect for launches · Events · Meetings · International Showcases
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12">
          <p className="text-2xl font-light leading-relaxed text-foreground/90 sm:text-3xl">
            &ldquo;VirtuEaze helped us explain the project clearly. Buyers
            understood the layout, views and amenities in the first
            meeting.&rdquo;
          </p>
          <p className="eyebrow mt-8 text-xs uppercase text-accent">
            Senior Sales Executive
          </p>
        </div>
      </section>

      <ModelViewer />

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-24 lg:flex-row lg:items-center lg:px-12">
          <div>
            <span className="eyebrow text-xs uppercase text-accent">
              Featured Projects
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight">
              See the twin behind the tower.
            </h2>
          </div>
          <Link
            href="/projects"
            className="whitespace-nowrap rounded-full border border-border px-7 py-3 text-sm font-medium transition-colors hover:border-accent"
          >
            View All Projects
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-12">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Want to increase conversion?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/60">
            Sell your property before you build it — bring VirtuEaze into your
            next launch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Book a Demo
            </a>
            <a
              href={DEMO_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:border-accent"
            >
              Watch the Demo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
