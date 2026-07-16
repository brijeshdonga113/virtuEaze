import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — VirtuEaze",
  description: "The terms that govern use of the VirtuEaze website and services.",
};

const sections = [
  {
    heading: "1. Agreement",
    body: [
      "These terms govern your use of the VirtuEaze website and, unless a separate written agreement applies, our digital twin services. By using this site you accept these terms.",
    ],
  },
  {
    heading: "2. What we provide",
    body: [
      "VirtuEaze creates interactive 3D digital twins of real-estate projects — including exteriors, interiors, amenities, day/night lighting, and locality context — for use in sales galleries, launches, and marketing, delivered for mobile, desktop, or VR as agreed per project.",
    ],
  },
  {
    heading: "3. Illustrative content",
    body: [
      "Digital twins, renderings, walkthroughs, and floor plans shown on this site or delivered as part of our services are visual representations created from the project information available at the time. They are intended to aid understanding and may differ from the final built product. They do not constitute an offer, warranty, or representation about any property by VirtuEaze or any developer.",
    ],
  },
  {
    heading: "4. Client materials",
    body: [
      "Clients retain ownership of the drawings, plans, brand assets, and other materials they provide. By sharing them, a client grants VirtuEaze the right to use those materials to build and deliver the commissioned digital twin.",
    ],
  },
  {
    heading: "5. Our work",
    body: [
      "Unless a project agreement states otherwise, VirtuEaze retains its underlying tools, technology, and know-how, while the client receives the agreed usage rights to the delivered twin for the commissioned project's marketing and sales.",
      "Content on this website — text, graphics, and showcase media — belongs to VirtuEaze or its clients and may not be reused without permission.",
    ],
  },
  {
    heading: "6. Acceptable use",
    body: [
      "You agree not to misuse this website — including attempting to breach its security, scraping content at scale, or using it to mislead property buyers.",
    ],
  },
  {
    heading: "7. Third-party services",
    body: [
      "Demo scheduling runs on Calendly and some showcase videos are hosted on YouTube. Those services have their own terms, which apply when you use them.",
    ],
  },
  {
    heading: "8. Liability",
    body: [
      "This website is provided as-is. To the maximum extent permitted by law, VirtuEaze is not liable for indirect or consequential losses arising from use of the site. Nothing in these terms limits liability that cannot be limited by law.",
      "Property purchase decisions should always be based on the developer's official documentation, not solely on a digital twin or marketing visualisation.",
    ],
  },
  {
    heading: "9. Changes",
    body: [
      "We may update these terms from time to time. The version posted on this page applies from its stated date.",
    ],
  },
  {
    heading: "10. Contact",
    body: [
      "Questions about these terms: contact@virtueaze.com — UAE office +971 58 946 8963, India office +91 91068 24049.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 lg:px-8">
      <span className="eyebrow text-xs uppercase text-accent">Legal</span>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-foreground/50">
        Effective date: 16 July 2026
      </p>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-medium">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-foreground/70">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
