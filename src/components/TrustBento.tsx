import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/virtueaze-vr/30min?back=1";

function Stars() {
  return (
    <div className="flex gap-1 text-accent" aria-label="Five star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.8l-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

const teamInitials = ["RS", "AK", "MJ", "PD"];

export default function TrustBento() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow text-xs uppercase text-accent">
              ✦ Why People Trust Us
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Real <span className="font-light italic text-accent">results</span>{" "}
              for developers.
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-5xl font-semibold text-accent">72+</p>
            <p className="mt-1 text-sm text-foreground/60">
              Happy clients worldwide
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* 30% faster decisions — wide card blending into its golden-hour render. */}
          <div className="trust-card-1 relative overflow-hidden rounded-3xl border border-border p-8 sm:col-span-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              30% faster decisions
            </h3>
            <p className="mt-2 max-w-xs text-sm text-foreground/60">
              Buyers understand the project instantly.
            </p>
            <div className="relative mt-8 h-40 overflow-hidden rounded-2xl">
              <Image
                src="/images/twin-seq/frame_0012.jpg"
                alt="Tremont digital twin exterior at golden hour"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <div className="trust-card-1-fade absolute inset-0" />
            </div>
          </div>

          {/* Better team performance — stars + avatar ring. */}
          <div className="flex flex-col rounded-3xl border border-border bg-muted p-8">
            <Stars />
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Better team performance
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              Your sales team presents with one powerful tool.
            </p>
            <div className="mt-auto flex items-center pt-8">
              {teamInitials.map((initials, i) => (
                <span
                  key={initials}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-[10px] font-medium text-foreground/70 ${
                    i > 0 ? "-ml-3" : ""
                  }`}
                >
                  {initials}
                </span>
              ))}
              <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                +68
              </span>
            </div>
          </div>

          {/* Perfect for launches — tall accent card blending into the dusk shot. */}
          <div className="trust-card-2 relative flex flex-col overflow-hidden rounded-3xl border border-accent/40 p-8 lg:row-span-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              Perfect for launches
            </h3>
            <ul className="mt-6 flex flex-col gap-4 text-foreground/80">
              {["Events", "Meetings", "International Showcases"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-accent">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get started
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <div className="relative mt-8 h-44 flex-1 overflow-hidden rounded-2xl">
              <Image
                src="/images/twin-seq/frame_0040.jpg"
                alt="Tremont tower digital twin at dusk"
                fill
                sizes="(min-width: 1024px) 22vw, 100vw"
                className="object-cover"
              />
              <div className="trust-card-2-fade absolute inset-0" />
            </div>
          </div>

          {/* 40% fewer objections — icon card. */}
          <div className="flex flex-col rounded-3xl border border-border bg-muted p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              40% fewer objections
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              Clear views reduce questions.
            </p>
            <div className="mt-auto pt-8">
              <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 text-accent">
                <rect x="4" y="8" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="11" cy="14" r="1.5" fill="currentColor" />
                <circle cx="17" cy="14" r="1.5" fill="currentColor" />
                <circle cx="23" cy="14" r="1.5" fill="currentColor" />
                <path
                  d="M14 28c3.5-5 6.5-7.5 10-7.5S30.5 23 34 28c-3.5 5-6.5 7.5-10 7.5S17.5 33 14 28z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="24" cy="28" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Reliable & future-ready — full-image card. */}
          <div className="relative flex min-h-56 items-end overflow-hidden rounded-3xl border border-border">
            <Image
              src="/images/twin-seq/frame_0090.jpg"
              alt="X-ray floor view of the Tremont digital twin"
              fill
              sizes="(min-width: 1024px) 22vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241d17]/95 via-[#241d17]/30 to-transparent" />
            <div className="relative p-8">
              {/* Sits on the dark photo gradient — keep text light in both themes. */}
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                Reliable &{" "}
                <span className="font-light italic text-accent">
                  future-ready
                </span>
              </h3>
            </div>
          </div>

          {/* Higher booking confidence — chat bubbles. */}
          <div className="flex flex-col rounded-3xl border border-border bg-muted p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              Higher booking confidence
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              Buyers trust what they can see clearly.
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-8">
              <span className="w-fit rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-2 text-sm text-foreground/80">
                Hey there!
              </span>
              <span className="ml-auto w-fit rounded-2xl rounded-br-sm bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                How can I help you?
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
