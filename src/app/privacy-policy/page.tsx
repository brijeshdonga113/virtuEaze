import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — VirtuEaze",
  description: "How VirtuEaze collects, uses, and protects your information.",
};

const sections = [
  {
    heading: "1. Who we are",
    body: [
      "VirtuEaze builds interactive 3D digital twins of real-estate projects for developers and their sales teams. We operate from our offices in Dubai, UAE and Ahmedabad, India. For anything in this policy, you can reach us at contact@virtueaze.com.",
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Contact details you give us — your name, email address, phone number, and anything you write in our contact form or share when booking a demo.",
      "Demo scheduling data — if you book a call through our scheduling provider (Calendly), they collect the details needed to arrange the meeting under their own privacy policy.",
      "Basic usage data — standard technical information such as browser type, device, pages visited, and approximate location derived from your IP address, used to understand how the site performs.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "To respond to your enquiries and schedule demos you request.",
      "To prepare proposals and deliver digital twin services for your project.",
      "To improve our website and showcase materials.",
      "We do not sell your personal information, and we do not use it for third-party advertising.",
    ],
  },
  {
    heading: "4. Project materials",
    body: [
      "Drawings, plans, elevations, and other project files that developers share with us are used solely to build their digital twin. They are treated as confidential, are not shared with other clients, and are deleted or returned on request after the engagement ends.",
    ],
  },
  {
    heading: "5. Sharing",
    body: [
      "We share information only with service providers who help us operate — such as website hosting, email, and scheduling — and only to the extent needed to provide the service. We may also disclose information where the law requires it.",
    ],
  },
  {
    heading: "6. Data retention",
    body: [
      "We keep enquiry and client information for as long as needed to serve you and meet legal obligations, then delete it. You can ask us to delete your information sooner at any time.",
    ],
  },
  {
    heading: "7. Your rights",
    body: [
      "You may request a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. Email contact@virtueaze.com and we will respond within a reasonable time.",
    ],
  },
  {
    heading: "8. Security",
    body: [
      "We use reasonable technical and organisational measures to protect the information we hold. No method of transmission or storage is completely secure, but we work to protect your data against unauthorised access, loss, or misuse.",
    ],
  },
  {
    heading: "9. Changes to this policy",
    body: [
      "If we change this policy, we will post the updated version on this page with a new effective date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 lg:px-8">
      <span className="eyebrow text-xs uppercase text-accent">Legal</span>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
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
