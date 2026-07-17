import Link from "next/link";
import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

export default function HeroCutout() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_75%_45%,rgba(201,164,76,0.25),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-36 lg:grid-cols-2 lg:px-12 lg:pb-28 lg:pt-44">
        <div>
          <span className="eyebrow text-xs uppercase text-accent">
            Digital Twin Platform
          </span>
          <h1 className="mt-4 max-w-lg text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            See every tower before it&apos;s built.
          </h1>
          <p className="mt-6 max-w-md text-foreground/70">
            VirtuEaze turns drawings into a fully interactive 3D digital twin —
            buyers explore the exterior, the interiors, and the neighbourhood
            before a single brick is laid.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
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
              View Projects
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            aria-hidden
            className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,164,76,0.35),transparent_70%)] blur-2xl sm:h-[520px] sm:w-[520px]"
          />
          <Image
            src="/images/tower-cutout.png"
            alt="VirtuEaze digital twin render of a luxury glass tower, isolated on a transparent background"
            width={1260}
            height={1440}
            priority
            sizes="(min-width: 1024px) 22rem, 60vw"
            className="relative z-10 h-auto w-full max-w-xs drop-shadow-2xl sm:max-w-sm"
          />
        </div>
      </div>
    </section>
  );
}
