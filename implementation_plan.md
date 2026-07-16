# Implementation Plan — Cinematic Scrollytelling Experience

**Codename:** `virtueaze-cinematic`
**Reference:** 10-frame screen recording in `/images-showcase` (RISE digital-twin walkthrough)
**Author:** Creative Development blueprint for a coding agent. Follow top-to-bottom; each phase is independently verifiable.

---

## 0. What the reference recording actually shows

Frame-by-frame analysis of `/images-showcase/image_01..10.jpg`:

| Frame | Scene | Interaction observed |
|---|---|---|
| 01 | Golden-hour aerial of a twin-wing tower in a green city | Bottom pill nav: Home • Apartment • Amenities • Locality. Right rail: day/night dial ("08:00"), moon/sun toggles |
| 02 | Same aerial, wings highlighted (green/cyan volumes) | Hover tooltips "Wing 1 — 25 Floors", "Wing 2 — 25 Floors"; stats bar: Total Wings 1 • G+25 • 144 apartments • 1881–2244 sqft • 83.15 m |
| 03 | Isometric 3D floor-plan cutaway, lit rooms in dark context | Room callouts with dimensions (Master Bedroom 11'0"×14'7", Kitchen 8'4"×11'0"…); context bar: Wing 1 • Floor 22 • A 2204 • 1904 Sq.Ft • 10'6" |
| 04 | Photoreal entry foyer, door ajar, marble wall | First-person walkthrough begins |
| 05 | Photoreal living room + kitchen, evening city view | Walkthrough continues; same context bar |
| 06 | Black transition frame | Hard cut / fade between chapters |
| 07 | Night aerial, amenities deck glowing amber cutaway | Callouts: Swimming Pool, Gym, Yoga, Library, Meditation Room, Indoor Games, Kids Pool, Semi-Open Terrace; amenities pill-carousel in bottom nav |
| 08 | Rooftop infinity pool at sunset, skyline horizon | Time dial mid-transition |
| 09 | Same pool at night ("02:17") | Day→night state change of the same camera |
| 10 | Night aerial of the full tower, city lights | Return to overview, nav back to Home |

**Design language to reproduce:** cinematic full-bleed 3D renders; one continuous "camera" the user drives by scrolling; floating glass-dark pill UI (`rounded-full`, `bg-black/60`, `backdrop-blur`); tiny uppercase tracked labels; amber/gold accent on dark; time-of-day as a core motif (day → dusk → night across the page); dimension/stat callouts that float beside the subject.

> The scroll experience translates the recording's *click-driven* tour into a *scroll-driven* narrative: Aerial arrival → wing/stats reveal → morph into the floor plan → interior stills → amenities night chapter → locality/globe footer.

---

## 1. Technology stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Spec says Next 14. ⚠️ If building inside the existing `virtuEaze` repo (Next 16.2.10), APIs may differ from training data — read `node_modules/next/dist/docs/` first per `AGENTS.md`. All code below uses App-Router-stable APIs (`next/image`, `next/font`, client components) that exist in both. |
| Styling | **Tailwind CSS v4** (already configured via `@tailwindcss/postcss`) | Design tokens via CSS variables in `globals.css` |
| Animation | **Framer Motion** (`npm i framer-motion`) | Section reveals, label fades, pill-nav micro-interactions |
| Smooth scroll | **Lenis** (`npm i lenis`) | ⚠️ `@studio-freight/lenis` is the deprecated package name; install `lenis` and import `Lenis from "lenis"`. Same API. |
| Scrollytelling | **Canvas 2D** + rAF | No WebGL needed for image sequences; keep it dependency-free |

**Do not add** GSAP, three.js, or scroll libraries beyond Lenis — the sequence player below covers every scroll effect in the reference.

---

## 2. Assets contract

The plan assumes these assets in `/public`. **Verify before coding — as of writing, none of these exist yet in the repo** (only `public/images/*.jpg` and the `images-showcase/` reference stills). If missing, stop and request them; do not substitute.

```
public/
  sequence-1/          # HERO: aerial arrival (clouds → tower reveal), JPEG frames
    frame_0001.jpg … frame_NNNN.jpg
  sequence-2/          # MORPH: tower → floor-plan cutaway, JPEG frames
    frame_0001.jpg … frame_NNNN.jpg
  globe-loop.mp4       # FOOTER: looping globe/locality video
```

Frame counts are **discovered at build time**, not hardcoded:

```ts
// src/lib/sequences.ts  (imported ONLY by server components)
import { readdirSync } from "node:fs";
import { join } from "node:path";

export function sequenceFrames(dir: "sequence-1" | "sequence-2"): string[] {
  return readdirSync(join(process.cwd(), "public", dir))
    .filter((f) => /\.(jpe?g|webp)$/i.test(f))
    .sort()
    .map((f) => `/${dir}/${f}`);
}
```

Server components call this and pass the resulting `string[]` down to client components as props — client code never touches `fs`.

---

## 3. Project structure

```
src/
  app/
    layout.tsx              # fonts, <SmoothScroll>, dark shell
    page.tsx                # assembles all sections (server component)
    globals.css             # tokens: #050505 bg, gold accent, tracked type
  components/
    SmoothScroll.tsx        # "use client" — Lenis provider wrapping children
    HeroScroll.tsx          # "use client" — canvas scrollytelling, sequence-1
    PlaneMorph.tsx          # "use client" — canvas scrollytelling, sequence-2
    SequenceCanvas.tsx      # "use client" — shared engine used by both above
    StatsBar.tsx            # wing/stats reveal band (frame 02 language)
    InteriorGallery.tsx     # photoreal stills chapter (frames 04–05)
    AmenitiesChapter.tsx    # dark amber chapter w/ floating callouts (frame 07)
    Globe.tsx               # video footer (globe-loop.mp4)
    PillNav.tsx             # fixed glass pill navigation (bottom center)
    FadeIn.tsx              # small framer-motion viewport-reveal helper
  hooks/
    useImagePreloader.ts    # decode + cache a frame list, report progress
    useScrollProgress.ts    # 0–1 progress of a ref'd section
  lib/
    sequences.ts            # fs frame discovery (server only)
    copy.ts                 # all page copy (section 8)
```

---

## 4. Global shell

### 4.1 `globals.css` tokens

```css
:root {
  --background: #050505;      /* deep charcoal-black */
  --foreground: #f5f4f0;      /* high-contrast warm white */
  --muted: #121210;
  --border: rgba(245, 244, 240, 0.10);
  --accent: #c9a44c;          /* champagne gold (matches reference UI) */
}
.eyebrow { letter-spacing: 0.25em; }   /* tiny uppercase labels everywhere */
```

Typography: Geist Sans via `next/font` (already the repo standard). Headings `font-light`→`font-semibold`, generous `tracking-tight` for display sizes, `uppercase tracking-[0.2em]` for labels. No serif anywhere.

### 4.2 `SmoothScroll.tsx`

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    let raf: number;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

Mounted once in `layout.tsx` around `{children}`. Respect `prefers-reduced-motion`: skip Lenis entirely when matched (see §9).

---

## 5. The scrollytelling engine

One shared component powers both sequence sections. **Do not duplicate this logic in HeroScroll and PlaneMorph** — they are thin wrappers.

### 5.1 `useImagePreloader.ts`

```ts
"use client";
import { useEffect, useRef, useState } from "react";

export function useImagePreloader(urls: string[]) {
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    images.current = new Array(urls.length).fill(null);
    // Load first + last + every Nth frame first for instant scrubbing,
    // then fill the gaps. All frames end up cached.
    const order = priorityOrder(urls.length); // [0, last, mids..., rest]
    order.forEach((i) => {
      const img = new Image();
      img.src = urls[i];
      img.decode?.().catch(() => {}).finally(() => {
        if (cancelled) return;
        images.current[i] = img;
        setLoaded((n) => n + 1);
      });
    });
    return () => { cancelled = true; };
  }, [urls]);

  return { images, progress: urls.length ? loaded / urls.length : 1 };
}
```

`priorityOrder`: `[0, N-1, N/2, N/4, 3N/4, …]` then remaining indexes ascending. When the canvas needs frame `i` and it isn't decoded yet, it draws the nearest lower loaded frame — scrubbing never blanks.

### 5.2 `SequenceCanvas.tsx` — core mechanics

```tsx
"use client";
// Props: frames: string[]; heightVh?: number (default 400);
//        children?: (progress: MotionValue<number>) => ReactNode  // overlays
```

Requirements:

1. **Sticky scaffold** — section `style={{ height: `${heightVh}vh` }}`, inner `div` `sticky top-0 h-screen overflow-hidden`.
2. **Scroll → frame mapping** — per rAF tick (or Lenis scroll event):
   ```ts
   const rect = section.getBoundingClientRect();
   const progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1);
   const frame = Math.min(frames.length - 1, Math.floor(progress * frames.length));
   ```
   Only redraw when `frame` changed (`lastFrame.current !== frame`).
3. **Canvas draw — "cover" fit, DPR aware**:
   ```ts
   canvas.width  = clientWidth  * devicePixelRatio;
   canvas.height = clientHeight * devicePixelRatio;
   const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
   const w = img.width * scale, h = img.height * scale;
   ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
   ```
   Re-render on `ResizeObserver`.
4. **Loading state** — until `progress ≥ 0.15` (first priority frames decoded), show frame 0 + a hairline gold progress bar bottom-center. Never a spinner.
5. **Overlay slot** — `children` renders inside the sticky container above the canvas (labels, scrims, headings driven by the same progress value).

### 5.3 `HeroScroll.tsx` (sequence-1 — clouds → arrival)

- `<SequenceCanvas frames={seq1} heightVh={400}>`
- Overlays, staged on progress:
  - `0.00–0.15`: centered wordmark + eyebrow "A New Way To Own The Sky" *(copy §8)*, small "Scroll" hint; fades out by 0.15.
  - `0.80–1.00`: bottom-left headline block fades in (frame-01 energy: project name + location line).
- Top/bottom scrims (`from-background/80 to-transparent`) keep the fixed nav legible, exactly like the reference's letterboxed UI.

### 5.4 `PlaneMorph.tsx` (sequence-2 — tower morphs into the cutaway plan)

- Same engine, `heightVh={350}`.
- Overlays replicate frame-02/03 furniture:
  - progress `0.1–0.4`: two floating "wing" tooltips (rounded-full, `bg-black/60 backdrop-blur`, white text + gold sublabel).
  - progress `0.45–0.75`: dimension callouts fade in one by one (Master Bedroom 11'0"×14'7" style — content from §8), each a pill with a 1px gold connector line (`<span class="block h-px w-10 bg-accent/60">`).
  - progress `0.8–1.0`: bottom context StatsBar slides up: `Wing 1 • Floor 22 • A 2204 • 1904 Sq.Ft • 10'6"`.

### 5.5 Chapter separators

Frame 06 (black) is the transition grammar: between chapters use plain `h-[20vh] bg-background` spacers — the letterbox breath, no fancy wipes.

---

## 6. Non-sequence sections

### 6.1 `StatsBar.tsx`
Full-width band, 4 stats in a `divide-x divide-border` grid (Total Wings / G+25 Floors / 144 Residences / 83.15 m). Gold numerals `text-4xl font-semibold text-accent`, labels `text-sm text-foreground/60`. Framer Motion `whileInView` count-up (integers only, 1s, once).

### 6.2 `InteriorGallery.tsx` (frames 04–05)
Two full-bleed `next/image` panels with parallax (`useScroll` + `useTransform`, y ±8%). Each panel: bottom-left room label pill + one-line copy. Alternate image left/text right, then reversed.

### 6.3 `AmenitiesChapter.tsx` (frame 07)
Dark section, amber-lit render as background `next/image`. Floating amenity pills (Swimming Pool, Gym, Yoga, Library, Meditation Room, Indoor Games) positioned absolutely at percentage coordinates; stagger-fade via Framer Motion `whileInView`. Below, a horizontally scrollable pill carousel mirroring the reference's bottom bar (plain overflow-x scroll + scroll-snap, no library).

### 6.4 `Globe.tsx` (footer)

```tsx
export default function Globe() {
  return (
    <section className="relative flex min-h-[90vh] items-end overflow-hidden">
      <video
        src="/globe-loop.mp4"
        autoPlay loop muted playsInline
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      {/* CTA block + footer columns on top */}
    </section>
  );
}
```

CTA: eyebrow "The Locality" → headline "Positioned at the centre of everything" → gold `rounded-full` button "Book a Private Preview". Standard 4-column footer beneath (reuse existing `Footer.tsx` pattern).

### 6.5 `PillNav.tsx`
Fixed `bottom-6 left-1/2 -translate-x-1/2 z-50`, glass pill (`rounded-full border border-border bg-black/60 backdrop-blur-md`). Items: Home • Residences • Amenities • Locality → anchor-scroll to sections via Lenis `scrollTo`. Active item = gold dot. Hide (`opacity-0 translate-y-4`) while hero progress < 0.1 so the opening is clean, like the recording's minimal first frame.

---

## 7. `page.tsx` assembly (server component)

```tsx
import { sequenceFrames } from "@/lib/sequences";
// …imports

export default function Home() {
  const seq1 = sequenceFrames("sequence-1");
  const seq2 = sequenceFrames("sequence-2");
  return (
    <>
      <HeroScroll frames={seq1} />
      <StatsBar />
      <div className="h-[20vh]" />           {/* frame-06 black breath */}
      <PlaneMorph frames={seq2} />
      <InteriorGallery />
      <div className="h-[20vh]" />
      <AmenitiesChapter />
      <Globe />
      <PillNav />
    </>
  );
}
```

---

## 8. Copy deck (original, luxury register — final)

All copy lives in `src/lib/copy.ts`. No lorem ipsum anywhere.

- **Hero eyebrow:** `RESIDENCES ABOVE THE CANOPY`
- **Hero headline:** `Arrive before it exists.`
- **Hero sub:** `A digital twin so faithful you can feel the morning light on the twenty-second floor — years before the ribbon is cut.`
- **Stats band labels:** `Two Wings` / `G + 25 Floors` / `144 Residences` / `83.15 Metres`
- **Morph chapter eyebrow/headline:** `THE RESIDENCE` / `Every inch, already yours.`
- **Dimension callouts:** Master Bedroom 11'0" × 14'7" • Living Room 11'0" × 11'0" • Kitchen 8'4" × 11'0" • Bedroom 3 11'6" × 14'6" • Balcony 11'0" × 4'2"
- **Interior panel 1 (foyer):** `First impressions, rendered honestly.` — `Book-matched marble, warm brass, a door that opens onto exactly what you were promised.`
- **Interior panel 2 (living):** `Dusk, on demand.` — `Watch the city light up beyond your glass — the twin simulates every hour you'll ever live here.`
- **Amenities eyebrow/headline:** `LEVEL 26` / `An entire floor that works for you.`
- **Globe/locality headline:** `Positioned at the centre of everything.`
- **CTA button:** `Book a Private Preview`
- **Footer disclaimer:** `Renderings shown are generated from the project's digital twin for demonstration and may differ from the final built product.`

---

## 9. Performance & accessibility budget

1. **Sequences:** JPEG quality ~70, max 1920×1080, target ≤ 120 frames/sequence (≈ 60–80 KB/frame → ≤ 10 MB/sequence). If source frames exceed this, downscale with `sharp` in a one-off script — do not ship 4K frames.
2. **Preload discipline:** sequence-2 preloading starts only when its section is within 1.5 viewports (`IntersectionObserver { rootMargin: "150%" }`), so the hero owns initial bandwidth.
3. **Draw discipline:** redraw only on frame-index change or resize; single rAF loop per mounted canvas; no state updates per scroll tick (refs + direct style writes, exactly like the existing `FlyThroughScene.tsx`).
4. **Reduced motion:** `prefers-reduced-motion` → no Lenis, sequences render a static mid frame with normal-flow text, video footer swaps to `poster` still.
5. **Video:** `globe-loop.mp4` ≤ 6 MB, H.264, `preload="metadata"`; it's below the fold.
6. **Fallbacks:** `<noscript>` and pre-hydration: canvas sections show frame 0 via an absolutely-positioned `<img>` behind the canvas.
7. **A11y:** every sequence section gets `role="img"` + `aria-label` describing the scene; overlay text is real DOM text; pill nav is a `<nav>` with `aria-current`.

Lighthouse targets: Performance ≥ 85 (desktop), CLS 0, no long task > 200 ms during scroll.

---

## 10. Build order (each step ends verifiable in the browser)

1. **Shell** — tokens, fonts, `SmoothScroll`, empty sections with copy. *Verify: smooth scroll feel, dark shell, all copy visible.*
2. **Engine** — `useImagePreloader` + `SequenceCanvas` with a temp frame set. *Verify: scrub hero by scrolling, no blank frames, resize stays crisp.*
3. **HeroScroll** — sequence-1 + staged overlays + scrims. *Verify: text fades at 0.15/0.8 breakpoints.*
4. **PlaneMorph** — sequence-2 + tooltips + callouts + StatsBar. *Verify: callout choreography matches §5.4 windows.*
5. **InteriorGallery + AmenitiesChapter.** *Verify: parallax subtle (≤8%), pills stagger once.*
6. **Globe footer + PillNav** wiring (Lenis anchors). *Verify: nav dots track sections both by click and by scroll.*
7. **Perf pass** — §9 checklist, throttled CPU×4 scroll test, reduced-motion pass.

---

## 11. Known deviations from the original brief (intentional)

- **"Jesko Jets" naming/content:** the supplied recording is a residential digital-twin tour, not a jet site. Structure (canvas hero sequence → morph sequence → video footer) is preserved verbatim; content and copy follow the actual frames and the VirtuEaze brand.
- **`lenis` vs `@studio-freight/lenis`:** package renamed upstream; use `lenis`.
- **Next 14 vs repo:** this repo runs Next 16 — trust `node_modules/next/dist/docs/` over the version pin in the brief.
- **Assets missing:** `/public/sequence-1`, `/public/sequence-2`, `/public/globe-loop.mp4` are not in the repo yet. Building steps 3, 4, 6 blocks on them; steps 1, 2, 5 do not.
