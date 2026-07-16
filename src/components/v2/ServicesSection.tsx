"use client";

import FadeIn from "@/components/v2/FadeIn";

const services = [
  {
    number: "01",
    name: "Digital Twins",
    description:
      "A fully interactive replica of your project — every floor, unit, and shared space explorable before construction begins.",
  },
  {
    number: "02",
    name: "Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    number: "03",
    name: "Interior Walkthroughs",
    description:
      "Move room to room, open the balcony, feel the real space — complete interiors buyers can walk at their own pace.",
  },
  {
    number: "04",
    name: "Day & Night Simulation",
    description:
      "Realistic lighting with sunrise, sunset, and shadow movement, so every hour a buyer will live in the space can be felt in advance.",
  },
  {
    number: "05",
    name: "Locality Mapping",
    description:
      "Metro, roads, malls, and schools mapped around the project for instant clarity on what living or working there really means.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <h2
          className="text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C]"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto mt-16 max-w-5xl sm:mt-20 md:mt-28">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1}>
            <div
              className="flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12"
              style={{ borderTop: "1px solid rgba(12, 12, 12, 0.15)" }}
            >
              <span
                className="font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {service.number}
              </span>
              <div className="pt-2">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {service.name}
                </h3>
                <p
                  className="mt-2 max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60"
                  style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
