# WebGL / 3D Hero — Implementation Plan & Asset Spec

Goal: replace (or upgrade) the current image-sequence hero with a real
scroll‑driven 3D scene in the spirit of the MotionSites "Performance Eyewear"
demo — a continuous cinematic push from the skyline into the tower and down
into a unit, driven by scroll instead of page movement.

This document is split so the two halves can run in parallel:

- **Part A — 3D asset spec**: hand this to a Blender/3D artist. Nothing in the
  web build can start looking real until a GLB exists.
- **Part B — web implementation**: the front-end work, which can be scaffolded
  against a placeholder model while Part A is produced.

---

## Where we are today (baseline)

| Piece | Current implementation | Reused / replaced |
| --- | --- | --- |
| Homepage hero | `EntrySequence.tsx` — scroll‑scrubbed pre‑rendered stills, CSS `scale()` zoom, per‑chapter captions | Kept as the **fallback** (see Part B §6) |
| "Hold the tower" | `ModelViewer.tsx` — CSS perspective tilt on a photo (not WebGL) | Unchanged |
| Old prototype | `FlyThroughScene.tsx` — R3F wireframe box + scroll camera keyframes, **unused** | Cannibalize its camera‑keyframe math; replace the wireframe with the GLB |
| Projects page | `TwinShowcase.tsx` — 160‑frame canvas scrub | Unchanged |
| Deps present | `three@0.185`, `@react-three/fiber@9`, `@react-three/drei@10` | Reused |
| Deps missing | GSAP/ScrollTrigger, `@react-three/postprocessing`, `three-stdlib` loaders, a GLB model, an HDRI | Add in Part B |

Stack context: **Next.js 16 (App Router, React 19)**, Tailwind v4, the gold
`--accent (#c9a44c)` theme, and the existing light/dark `ThemeProvider`.

---

## Part A — 3D asset spec (for the Blender artist)

### A1. Deliverables
1. One optimized **`tower.glb`** (glTF 2.0 binary, Draco or Meshopt compressed).
2. One **`.hdr` / `.exr` environment** map (or confirmation to use a stock studio
   HDRI) for image‑based lighting.
3. A short **turntable/preview MP4** for sign‑off before web integration.

### A2. Scene contents (must match the 5 narrative "stages")
The camera path lands on these beats — the model must contain each as a real,
separable object so the camera can travel to it:

1. **Skyline / establishing** — the tower in context (a low‑poly city plate or a
   simple ground + haze is enough; hero is the tower).
2. **The crown** — detailed top of the tower (glass mullions, crown lighting).
3. **The rooftop** — rooftop deck geometry.
4. **The reveal** — a **cutaway / exploded** floor so the camera can pass through
   the facade into the interior (model the facade as a separate object that can
   be faded/opened).
5. **The interior** — one furnished unit (living room + the boardroom/dining area
   already shown in the floor‑plan art). This is the close‑up "product detail".

Each beat should have a clean **empty/locator** named `cam_01_ascent`,
`cam_02_crown`, `cam_03_rooftop`, `cam_04_reveal`, `cam_05_interior` marking the
intended camera position **and** a matching `look_0x` target empty. Exporting
these as named nodes lets the web code read them straight out of the GLB instead
of hand‑tuning coordinates.

### A3. Budget & optimization (this is the make‑or‑break for web perf)
- **Triangles**: aim ≤ 500k total for the whole scene; hard ceiling 1M. Interiors
  cost more than the shell — keep furniture mid‑poly.
- **Draw calls**: merge by material; target ≤ ~80 meshes.
- **Textures**: **bake** lighting/AO into textures where possible (see A4). Albedo
  atlases at 2K; a single 4K only for the hero glass if truly needed. Use KTX2 /
  Basis compression on export.
- **Materials**: PBR metal‑rough. The glass tower needs one good glass material
  (transmission or a cheaper fresnel‑fake — confirm which during sign‑off; real
  transmission is expensive on mobile).
- **Scale/units**: model in **metres**, Y‑up, origin at the tower base centre.
- **No cameras/lights baked into the mesh nodes** except the named locators.

### A4. Lighting
- Prefer **baked lighting + AO** into textures for the static shell (cheapest,
  most cinematic, matches the demo). Keep 1 HDRI for reflections/ambient.
- Dynamic lights only for the interior "lights switch on" moment (≤ 2–3 lights).
- Provide a **day** and a **night** emissive texture set for the window glow if
  we want the day↔night toggle from the earlier video concept.

### A5. Export checklist (Blender → glTF)
- Format: **glTF Binary (.glb)**, +Y up, apply modifiers, apply transforms.
- Compression: **Draco** (or Meshopt) mesh compression ON.
- Include: named empties (locators), custom normals, UVs, tangents.
- Textures: pack, then run through `gltf-transform` / `gltfpack` for KTX2.
- Target final file size: **≤ 8 MB** ideal, ≤ 15 MB acceptable, over that we
  stream/lazy‑load.

---

## Part B — Web implementation

### B1. Libraries to add
- `gsap` + ScrollTrigger **or** drei `<ScrollControls>`/`useScroll`. Recommendation:
  **drei ScrollControls** — it's already in our dependency (`@react-three/drei`),
  keeps scroll state inside the R3F loop, and avoids wiring a second animation
  system. Use GSAP only if we later need timeline sequencing outside the canvas.
- `@react-three/postprocessing` (bloom, depth‑of‑field, vignette).
- `three-stdlib` `GLTFLoader` + `DRACOLoader`/`MeshoptDecoder` (drei's
  `useGLTF` already wraps this; just host the decoder).
- `maath` (drei's easing helpers) for damped camera moves.

### B2. Component architecture
```
components/hero3d/
  Hero3D.tsx          // client, <Canvas> + <ScrollControls pages={6}>
  TowerScene.tsx      // useGLTF('/models/tower.glb'), places the model
  ScrollCamera.tsx    // reads useScroll(), lerps camera between cam_0x locators
  Effects.tsx         // <EffectComposer> bloom + DoF (desktop only)
  captions.ts         // the same 01–05 chapter copy we already wrote
  Hero3DFallback.tsx  // re-exports the existing <EntrySequence/>
```
- **Camera path**: read the `cam_0x`/`look_0x` empties from the GLB, build an
  array of `{pos, target}` keyframes (exactly the shape `FlyThroughScene.tsx`
  already uses — reuse `cameraStateAt(progress)`), then damp toward the
  scroll‑derived keyframe each frame. This is the "scroll controls the camera"
  behaviour.
- **Captions**: overlay in normal DOM on top of the canvas (not in WebGL) so they
  stay crisp, themeable, and accessible — reuse the caption block from
  `EntrySequence.tsx` verbatim.
- **Facade reveal**: animate the facade material `opacity`/clip between stage 3→4
  so the camera "enters" without a hard cut.

### B3. Performance & UX guards (non‑negotiable for a real building site)
- **Progressive enhancement**: detect WebGL2 + not‑low‑end + `matchMedia('(min-width: 1024px)')`.
  If any fail → render `Hero3DFallback` (the current `EntrySequence`). So mobile
  and old GPUs keep the fast image hero.
- **`prefers-reduced-motion`** → fallback as well (or freeze the camera and let
  scroll just fade captions).
- Lazy‑load the canvas with `next/dynamic({ ssr:false })`; show the first still
  as an instant LCP poster while the GLB streams.
- Cap DPR (`dpr={[1, 1.75]}`), disable postprocessing under 60fps via a runtime
  check, pause `requestAnimationFrame` when the hero scrolls out of view.
- Keep an FPS/heap check in dev; budget: interactive < 3 s on a mid laptop, GLB
  streamed not blocking.

### B4. Theme + brand fit
- Drive fog/background from the CSS vars (`--background`) so the 3D scene matches
  light/dark mode at the edges where it meets the page.
- Crown/interior accent lighting in the gold `--accent` hue for brand continuity.

### B5. Integration point
- New route `/hero-3d` first (mirror of `/hero-preview`) for sign‑off, then swap
  `<EntrySequence/>` → `<Hero3D/>` in `src/app/page.tsx` once approved — same
  one‑line swap we just did to promote the sequence.

### B6. Fallback is permanent, not temporary
The image‑sequence hero (`EntrySequence`) stays in the codebase as the mobile /
low‑end / reduced‑motion path forever. The 3D hero is an enhancement layered on
top, never the only way in.

---

## Milestones

| Phase | Work | Depends on |
| --- | --- | --- |
| 0 | This plan signed off; artist briefed with Part A | — |
| 1 | **(parallel)** Web scaffold: `Hero3D` with a **primitive placeholder** (box/undefined tower), ScrollControls camera, captions, fallback switch | none (uses placeholder) |
| 2 | Blender model + GLB delivered (Part A) | artist |
| 3 | Swap placeholder → real GLB; tune the 5 camera locators; facade reveal | phase 1 + 2 |
| 4 | Lighting/HDRI, bloom + DoF, day/night emissive toggle | phase 3 |
| 5 | Perf pass (KTX2, Draco, DPR, mobile fallback QA), `/hero-3d` sign‑off | phase 4 |
| 6 | Promote to `/` homepage | phase 5 |

## The one hard dependency
Everything visual hinges on **Part A's `tower.glb`**. The web scaffold (phase 1)
can be built now against a placeholder, but the site won't *look* like the
reference until a real modeled/textured/baked building exists — that's a
3D‑artist deliverable, not something generated in code.
