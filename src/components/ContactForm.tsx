"use client";

import { useState } from "react";

const CONTACT_EMAIL = "contact@virtueaze.com";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");

    const subject = `Digital twin enquiry from ${name || "website visitor"}`;
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSent(true);
    event.currentTarget.reset();
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-border p-8 text-sm text-foreground/70">
        <p className="text-lg font-medium text-foreground">
          Your email app should be open now.
        </p>
        <p>
          If nothing happened, email us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:opacity-80"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 w-fit text-xs uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-foreground/60">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-foreground/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-foreground/60">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="mt-4 self-start rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Send
      </button>
    </form>
  );
}
