import type { Metadata } from "next";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Tremont Residence — VirtuEaze",
  description:
    "An editorial preview: a sculpted glass sky-residence where daylight is the architecture.",
};

const stats = [
  { value: "4", label: "Bedrooms" },
  { value: "5.5", label: "Baths" },
  { value: "620 m²", label: "Interior" },
  { value: "G+33", label: "Floor" },
];

const features = [
  {
    kicker: "01",
    title: "The Terrace",
    body: "A private sky-deck wrapped in glass, where the river bends and the city softens into evening.",
    src: "/images/entry-03-rooftop-day.jpg",
    alt: "Rooftop terrace of the residence in daylight",
  },
  {
    kicker: "02",
    title: "The Living Volume",
    body: "One continuous room, floor to ceiling in light, opening onto the skyline through frameless glass.",
    src: "/images/entry-05-interior-day.jpg",
    alt: "Sunlit living room with panoramic glass",
  },
  {
    kicker: "03",
    title: "The Whole Floor",
    body: "Bedrooms, bath, dressing and lounge — a single sculpted plate lifted above the city.",
    src: "/images/entry-04-cutaway-day.jpg",
    alt: "Cutaway view of the full residence floor",
  },
];

const gallery = [
  { src: "/images/entry-01-skyline-day.jpg", alt: "The tower against the daytime skyline" },
  { src: "/images/entry-05-interior.jpg", alt: "The living room at dusk" },
  { src: "/images/entry-03-rooftop.jpg", alt: "The terrace at golden hour" },
];

const reviews = [
  {
    quote:
      "We understood the entire home in a single afternoon. The light, the views, the flow — nothing left to imagine.",
    name: "Ananya R.",
    role: "Buyer, Sky Collection",
  },
  {
    quote:
      "The most convincing preview of an unbuilt home I have seen. It sold itself.",
    name: "Marcus D.",
    role: "Private Client Advisor",
  },
];

export default function TremontResidencePage() {
  return (
    <div className="bg-[#f6f1ea] text-[#211d17]">
      {/* Minimal editorial top bar */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 text-white lg:px-10">
          <span
            className={`${serif.className} text-xl tracking-wide sm:text-2xl`}
          >
            The Tremont
          </span>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.25em] sm:flex">
            <a href="#residence" className="transition-opacity hover:opacity-70">
              Residence
            </a>
            <a href="#gallery" className="transition-opacity hover:opacity-70">
              Gallery
            </a>
            <a href="#reserve" className="transition-opacity hover:opacity-70">
              Reserve
            </a>
          </nav>
          <a
            href="#reserve"
            className="rounded-full border border-white/50 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#211d17]"
          >
            Book a stay
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <Image
          src="/images/entry-05-interior-day.jpg"
          alt="Sunlit living room of the Tremont sky residence"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 pb-14 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-20">
            <div className="max-w-2xl text-white">
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/80">
                Gota · Ahmedabad
              </span>
              <h1
                className={`${serif.className} mt-5 text-5xl font-light leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl`}
              >
                Light pours through
                <br />
                <span className="italic">every room.</span>
              </h1>
            </div>

            <div className="flex items-end gap-8 text-white">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                  From
                </p>
                <p className={`${serif.className} text-4xl sm:text-5xl`}>
                  €1,250
                  <span className="text-lg text-white/70"> / night</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial statement */}
      <section
        id="residence"
        className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32 lg:px-10"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#a9853a]">
          The Residence
        </span>
        <p
          className={`${serif.className} mt-8 text-3xl font-light leading-tight tracking-tight sm:text-5xl`}
        >
          A sculpted glass residence above the river, where daylight is the
          architecture and the city is the view.
        </p>
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`${serif.className} text-3xl sm:text-4xl`}>
                {s.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6b6459]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Alternating feature rows */}
      <section className="mx-auto max-w-[1400px] px-6 pb-8 lg:px-10">
        <div className="flex flex-col gap-24 sm:gap-32">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#a9853a]">
                  {f.kicker}
                </span>
                <h2
                  className={`${serif.className} mt-4 text-4xl font-light tracking-tight sm:text-5xl`}
                >
                  {f.title}
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5c554b]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-[1400px] px-6 py-24 sm:py-32 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <h2
            className={`${serif.className} text-4xl font-light tracking-tight sm:text-5xl`}
          >
            Gallery
          </h2>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6b6459]">
            Digital twin · VirtuEaze
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {gallery.map((g, i) => (
            <div
              key={g.src}
              className={`relative overflow-hidden rounded-sm ${
                i === 0 ? "aspect-[3/4] sm:col-span-2 sm:aspect-[16/11]" : "aspect-[3/4]"
              }`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Booking + reviews */}
      <section id="reserve" className="bg-[#efe7db]">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 sm:py-32 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#a9853a]">
              Reserve
            </span>
            <h2
              className={`${serif.className} mt-6 max-w-md text-4xl font-light leading-tight tracking-tight sm:text-6xl`}
            >
              Stay in a home not yet built.
            </h2>
            <div className="mt-10 flex items-center gap-4">
              <span className={`${serif.className} text-3xl`}>4.9</span>
              <span className="text-[#a9853a]" aria-label="Five stars">
                ★★★★★
              </span>
              <span className="text-sm text-[#6b6459]">128 reviews</span>
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              {reviews.map((r) => (
                <figure key={r.name}>
                  <blockquote
                    className={`${serif.className} text-xl font-light italic leading-snug`}
                  >
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#6b6459]">
                    {r.name} — {r.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Booking card */}
          <div className="rounded-sm border border-[#ddd0bd] bg-[#f6f1ea] p-8 shadow-[0_30px_60px_-40px_rgba(33,29,23,0.5)]">
            <div className="flex items-baseline justify-between">
              <p className={`${serif.className} text-3xl`}>
                €1,250
                <span className="text-base text-[#6b6459]"> / night</span>
              </p>
              <span className="text-sm text-[#6b6459]">★ 4.9</span>
            </div>

            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-sm border border-[#ddd0bd]">
              <label className="flex flex-col gap-1 border-r border-[#ddd0bd] p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6b6459]">
                  Check in
                </span>
                <input
                  type="date"
                  defaultValue="2026-08-14"
                  className="bg-transparent text-sm outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6b6459]">
                  Check out
                </span>
                <input
                  type="date"
                  defaultValue="2026-08-19"
                  className="bg-transparent text-sm outline-none"
                />
              </label>
              <label className="col-span-2 flex flex-col gap-1 border-t border-[#ddd0bd] p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6b6459]">
                  Guests
                </span>
                <select className="bg-transparent text-sm outline-none">
                  <option>2 guests</option>
                  <option>4 guests</option>
                  <option>6 guests</option>
                </select>
              </label>
            </div>

            <a
              href="https://calendly.com/virtueaze-vr/30min?back=1"
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-full bg-[#211d17] py-4 text-center text-[11px] uppercase tracking-[0.25em] text-[#f6f1ea] transition-opacity hover:opacity-90"
            >
              Reserve
            </a>

            <dl className="mt-6 space-y-2 text-sm text-[#5c554b]">
              <div className="flex justify-between">
                <dt>€1,250 × 5 nights</dt>
                <dd>€6,250</dd>
              </div>
              <div className="flex justify-between">
                <dt>Concierge</dt>
                <dd>€250</dd>
              </div>
              <div className="flex justify-between border-t border-[#ddd0bd] pt-3 font-medium text-[#211d17]">
                <dt>Total</dt>
                <dd>€6,500</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative flex h-[70vh] min-h-[460px] items-center justify-center overflow-hidden">
        <Image
          src="/images/entry-01-skyline-day.jpg"
          alt="The tower against the skyline"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative px-6 text-center text-white">
          <h2
            className={`${serif.className} text-4xl font-light leading-tight tracking-tight sm:text-6xl`}
          >
            The Tremont Residence
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/80">
            A VirtuEaze digital twin — every room, view and hour of light, before
            a single brick is laid.
          </p>
          <a
            href="#reserve"
            className="mt-8 inline-block rounded-full border border-white/60 px-8 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-[#211d17]"
          >
            Reserve your stay
          </a>
        </div>
      </section>
    </div>
  );
}
