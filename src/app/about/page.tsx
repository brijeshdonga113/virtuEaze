import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — VirtuEaze",
  description:
    "VirtuEaze creates fully interactive 3D digital twins that let buyers explore a property before construction begins.",
};

const facts = [
  { value: "72+", label: "Happy clients worldwide" },
  { value: "2", label: "Offices — Dubai & Ahmedabad" },
  { value: "3", label: "Platforms — mobile, desktop, VR" },
];

const beliefs = [
  {
    step: "01",
    title: "Explore it like a game",
    description:
      "A VirtuEaze twin isn't a video to watch — it's a world to walk. Buyers move floor to floor, room to room, at their own pace.",
  },
  {
    step: "02",
    title: "Show real life, not renders",
    description:
      "Day turns to night, shadows move, the neighbourhood sits exactly where it will be. The unbuilt behaves like the built.",
  },
  {
    step: "03",
    title: "Put the buyer in control",
    description:
      "Every tap answers a question — which floor, which view, which layout — before it becomes an objection.",
  },
];

const offices = [
  {
    city: "Dubai, UAE",
    address: "Office 1234, XYZ Tower, Business Bay",
    phone: "+971 58 946 8963",
    tel: "+971589468963",
  },
  {
    city: "Ahmedabad, India",
    address: "201, ABC Complex, CG Road, Gujarat 380009",
    phone: "+91 91068 24049",
    tel: "+919106824049",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-12">
      <span className="eyebrow text-xs uppercase text-accent">About</span>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        We make the unbuilt explorable.
      </h1>
      <p className="mt-6 max-w-2xl text-foreground/60">
        VirtuEaze creates a fully interactive 3D digital twin of your project.
        Buyers explore every corner of the property before construction begins
        — just like a real game. From residential towers and townships to
        commercial spaces and sales galleries, we turn drawings into an
        experience a buyer can trust.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-background px-6 py-10 text-center">
            <p className="text-4xl font-semibold text-accent">{fact.value}</p>
            <p className="mt-2 text-sm text-foreground/60">{fact.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
        {beliefs.map((item) => (
          <div key={item.step} className="border-t border-border pt-6">
            <span className="eyebrow text-xs uppercase text-foreground/40">
              {item.step}
            </span>
            <h2 className="mt-3 text-lg font-medium">{item.title}</h2>
            <p className="mt-2 text-sm text-foreground/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 border-t border-border pt-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why it matters
          </h2>
          <p className="mt-4 text-foreground/60">
            Off-plan sales are the hardest sales in real estate — buyers commit
            to something they can&apos;t yet see. VirtuEaze closes that gap by
            giving developers a tool that makes the unbuilt feel real: in the
            sales gallery, at a launch event, or on a buyer&apos;s phone on the
            other side of the world.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Book a Demo
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {offices.map((office) => (
            <div key={office.city}>
              <span className="eyebrow text-xs uppercase text-foreground/40">
                {office.city}
              </span>
              <p className="mt-2 text-sm text-foreground/70">{office.address}</p>
              <a
                href={`tel:${office.tel}`}
                className="mt-1 block text-sm text-foreground/70 hover:text-foreground"
              >
                {office.phone}
              </a>
            </div>
          ))}
          <a
            href="mailto:contact@virtueaze.com"
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            contact@virtueaze.com
          </a>
        </div>
      </div>
    </div>
  );
}
