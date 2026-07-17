import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — VirtuEaze",
  description: "Book a demo of the VirtuEaze digital twin platform.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-40 lg:px-12">
      <span className="eyebrow text-xs uppercase text-accent">Contact</span>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Book a demo.
      </h1>
      <p className="mt-6 max-w-lg text-foreground/60">
        Tell us about your project and we&apos;ll show you what it looks like
        as a digital twin.
      </p>
      <a
        href="https://calendly.com/virtueaze-vr/30min?back=1"
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Book a 30-Minute Demo
      </a>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6 text-sm">
          <div>
            <span className="eyebrow text-xs uppercase text-foreground/40">
              Email
            </span>
            <a
              href="mailto:contact@virtueaze.com"
              className="mt-1 block text-foreground/80 hover:text-foreground"
            >
              contact@virtueaze.com
            </a>
          </div>
          <div>
            <span className="eyebrow text-xs uppercase text-foreground/40">
              UAE Office
            </span>
            <a
              href="tel:+971589468963"
              className="mt-1 block text-foreground/80 hover:text-foreground"
            >
              +971 58 946 8963
            </a>
            <p className="mt-1 text-foreground/60">
              Office 1234, XYZ Tower, Business Bay, Dubai
            </p>
          </div>
          <div>
            <span className="eyebrow text-xs uppercase text-foreground/40">
              India Office
            </span>
            <a
              href="tel:+919106824049"
              className="mt-1 block text-foreground/80 hover:text-foreground"
            >
              +91 91068 24049
            </a>
            <p className="mt-1 text-foreground/60">
              201, ABC Complex, CG Road, Ahmedabad, Gujarat 380009
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
