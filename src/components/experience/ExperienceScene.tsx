"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// Drop a real building model here (GLB, Draco or plain) and it replaces the
// procedural tower automatically — the camera choreography stays identical.
const TOWER_GLB_URL = "/models/tower.glb";

// Shared, mutated once per frame by the DOM scroll rig in LuxuryExperience.
export type MotionState = { p: number };

// Camera fit for the close beats — 1 for the procedural envelope; the GLB
// loader lowers it for slimmer models so they still fill the frame.
const fitState = { value: 1 };

const FLOORS = 24;
const FLOOR_H = 1.15;
const TOWER_W = 10;
const TOWER_D = 10;
const TOWER_H = FLOORS * FLOOR_H;
export const FOCUS_FLOOR = 19;
const FOCUS_Y = (FOCUS_FLOOR + 0.5) * FLOOR_H;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

// Camera stations follow the brief's scroll timeline percentages.
const STATIONS = [
  { at: 0.0, pos: [52, 14, 74], look: [0, 15, 0] }, // wide skyline
  { at: 0.1, pos: [34, 14, 52], look: [0, 15, 0] }, // slow push
  { at: 0.25, pos: [-28, 17, 42], look: [0, 16, 0] }, // slight orbit
  { at: 0.4, pos: [-16, 20, 23], look: [0, 19, 0] }, // closer to facade
  { at: 0.55, pos: [-11.5, FOCUS_Y + 1.4, 17], look: [0, FOCUS_Y, 0] }, // apartment
  { at: 0.7, pos: [-10.5, FOCUS_Y + 1.6, 14.5], look: [0, FOCUS_Y, 0] }, // walls fade
  { at: 0.85, pos: [14, FOCUS_Y + 13, 16], look: [0, FOCUS_Y + 1, 0] }, // floor plan
  { at: 1.0, pos: [0, FOCUS_Y + 3.4, 4], look: [0, FOCUS_Y, -2] }, // step inside
] as const;

const INTRO_POS = new THREE.Vector3(74, 16, 100);
const INTRO_LOOK = new THREE.Vector3(0, 15, 0);

function poseAt(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let i = 0;
  while (i < STATIONS.length - 2 && p > STATIONS[i + 1].at) i++;
  const a = STATIONS[i];
  const b = STATIONS[i + 1];
  const raw = Math.min(Math.max((p - a.at) / (b.at - a.at), 0), 1);
  // Ease each leg so arrivals settle instead of stopping abruptly.
  const t = raw * raw * (3 - 2 * raw);
  outPos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t,
  );
  outLook.set(
    a.look[0] + (b.look[0] - a.look[0]) * t,
    a.look[1] + (b.look[1] - a.look[1]) * t,
    a.look[2] + (b.look[2] - a.look[2]) * t,
  );
}

function CameraRig({ motion }: { motion: React.MutableRefObject<MotionState> }) {
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);
  const curLook = useMemo(() => INTRO_LOOK.clone(), []);
  const start = useRef<number | null>(null);

  useFrame(({ camera, clock }, dt) => {
    if (start.current === null) start.current = clock.elapsedTime;
    // 2s cinematic push on load, then scroll takes over.
    const introRaw = Math.min((clock.elapsedTime - start.current) / 2, 1);
    const intro = introRaw * introRaw * (3 - 2 * introRaw);

    poseAt(motion.current.p, goalPos, goalLook);
    // Slim GLB towers: pull in during the residence/x-ray beats so the
    // building still fills the frame.
    const fit = fitState.value;
    if (fit < 1) {
      const p = motion.current.p;
      const closeness =
        smoothstep(0.42, 0.55, p) * (1 - smoothstep(0.78, 0.88, p));
      goalPos.lerp(goalLook, (1 - fit) * 0.5 * closeness);
    }
    goalPos.lerpVectors(INTRO_POS, goalPos, intro);
    goalLook.lerpVectors(INTRO_LOOK, goalLook, intro);

    // A last exponential chase on the pose itself keeps every move silky,
    // and a slow sway keeps held frames alive.
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
    const sway = Math.sin(clock.elapsedTime * 0.22) * 0.18;
    camera.position.lerp(goalPos, k);
    curLook.lerp(goalLook, k);
    camera.lookAt(curLook.x + sway, curLook.y, curLook.z);
  });
  return null;
}

// Podium occupies the first two levels, wider than the tower shaft —
// mirroring the real Tremont massing.
const PODIUM_LEVELS = 2;
const PODIUM_TOP = PODIUM_LEVELS * FLOOR_H;
const SHAFT_H = TOWER_H - PODIUM_TOP;

function Tower({ motion }: { motion: React.MutableRefObject<MotionState> }) {
  const facade = useRef<THREE.MeshPhysicalMaterial>(null);
  const focusGlow = useRef<THREE.MeshStandardMaterial>(null);

  const slabs = useMemo(() => {
    const m = new THREE.Matrix4();
    const list: THREE.Matrix4[] = [];
    for (let i = PODIUM_LEVELS; i <= FLOORS; i++) {
      list.push(m.clone().setPosition(0, i * FLOOR_H, 0));
    }
    return list;
  }, []);

  // The real facade's signature: cream ribbons that wave down the glass.
  const waves = useMemo(() => {
    const items: { pos: [number, number, number]; face: "x" | "z" }[] = [];
    const anchors = [-2.3, 2.3];
    for (let f = PODIUM_LEVELS; f < FLOORS; f++) {
      const y = f * FLOOR_H + FLOOR_H / 2;
      anchors.forEach((anchor, a) => {
        const sway =
          Math.sin((f / FLOORS) * Math.PI * 2 + a * 1.7) * 0.95;
        items.push({ pos: [anchor + sway, y, TOWER_D / 2 + 0.16], face: "z" });
        items.push({
          pos: [anchor - sway, y, -(TOWER_D / 2 + 0.16)],
          face: "z",
        });
        items.push({ pos: [TOWER_W / 2 + 0.16, y, anchor - sway], face: "x" });
        items.push({
          pos: [-(TOWER_W / 2 + 0.16), y, anchor + sway],
          face: "x",
        });
      });
    }
    return items;
  }, []);

  // Dense vertical mullions — the ribbed curtain-wall read.
  const ribs = useMemo(() => {
    const items: { pos: [number, number, number]; face: "x" | "z" }[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const along = (i / (count - 1) - 0.5) * (TOWER_W - 1.2);
      const y = PODIUM_TOP + SHAFT_H / 2;
      items.push({ pos: [along, y, TOWER_D / 2 + 0.06], face: "z" });
      items.push({ pos: [along, y, -(TOWER_D / 2 + 0.06)], face: "z" });
      items.push({ pos: [TOWER_W / 2 + 0.06, y, along], face: "x" });
      items.push({ pos: [-(TOWER_W / 2 + 0.06), y, along], face: "x" });
    }
    return items;
  }, []);

  // Warm lit windows scattered across the facade — dusk occupancy.
  const windows = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number }[] = [];
    const cols = 7;
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    };
    const rand = rng(42);
    const faces = [
      { rot: 0, axis: "x" as const, offset: TOWER_D / 2 + 0.06 },
      { rot: Math.PI, axis: "x" as const, offset: -(TOWER_D / 2 + 0.06) },
      { rot: Math.PI / 2, axis: "z" as const, offset: TOWER_W / 2 + 0.06 },
      { rot: -Math.PI / 2, axis: "z" as const, offset: -(TOWER_W / 2 + 0.06) },
    ];
    for (const face of faces) {
      for (let f = PODIUM_LEVELS + 1; f < FLOORS; f++) {
        for (let c = 0; c < cols; c++) {
          if (rand() > 0.28) continue;
          const along = (c / (cols - 1) - 0.5) * (TOWER_W - 2.4);
          const y = f * FLOOR_H + FLOOR_H * 0.5;
          items.push(
            face.axis === "x"
              ? { pos: [along, y, face.offset], rot: face.rot }
              : { pos: [face.offset, y, along], rot: face.rot },
          );
        }
      }
    }
    return items;
  }, []);

  useFrame(() => {
    const p = motion.current.p;
    if (facade.current) {
      // 70% — exterior walls become transparent.
      facade.current.opacity = 0.62 - smoothstep(0.62, 0.8, p) * 0.5;
    }
    if (focusGlow.current) {
      // 55% — the selected apartment lights up.
      focusGlow.current.emissiveIntensity =
        0.25 + smoothstep(0.48, 0.58, p) * 2.1;
    }
  });

  return (
    <group>
      {/* Glass shaft above the podium */}
      <mesh
        position={[0, PODIUM_TOP + SHAFT_H / 2, 0]}
        renderOrder={2}
      >
        <boxGeometry args={[TOWER_W, SHAFT_H, TOWER_D]} />
        <meshPhysicalMaterial
          ref={facade}
          color="#8ea9bd"
          metalness={0.35}
          roughness={0.08}
          transparent
          opacity={0.62}
          depthWrite={false}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Charcoal recessed bays behind the ribs */}
      {[TOWER_D / 2 + 0.02, -(TOWER_D / 2 + 0.02)].map((z, i) => (
        <mesh key={`bz-${i}`} position={[0, PODIUM_TOP + SHAFT_H / 2, z]}>
          <boxGeometry args={[3.1, SHAFT_H, 0.05]} />
          <meshStandardMaterial color="#2e3238" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {[TOWER_W / 2 + 0.02, -(TOWER_W / 2 + 0.02)].map((x, i) => (
        <mesh key={`bx-${i}`} position={[x, PODIUM_TOP + SHAFT_H / 2, 0]}>
          <boxGeometry args={[0.05, SHAFT_H, 3.1]} />
          <meshStandardMaterial color="#2e3238" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* Vertical mullion ribs */}
      {ribs.map((r, i) => (
        <mesh key={`rib-${i}`} position={r.pos}>
          <boxGeometry
            args={r.face === "z" ? [0.07, SHAFT_H, 0.09] : [0.09, SHAFT_H, 0.07]}
          />
          <meshStandardMaterial color="#e8dfc9" roughness={0.55} />
        </mesh>
      ))}

      {/* Flowing cream ribbons */}
      {waves.map((w, i) => (
        <mesh key={`wave-${i}`} position={w.pos}>
          <boxGeometry
            args={
              w.face === "z"
                ? [1.05, FLOOR_H + 0.02, 0.3]
                : [0.3, FLOOR_H + 0.02, 1.05]
            }
          />
          <meshStandardMaterial color="#ece2cc" roughness={0.5} />
        </mesh>
      ))}

      {/* Floor slabs */}
      {slabs.map((m, i) => (
        <mesh
          key={i}
          position={[0, (i + PODIUM_LEVELS) * FLOOR_H, 0]}
          castShadow={i % 3 === 0}
        >
          <boxGeometry args={[TOWER_W + 0.35, 0.14, TOWER_D + 0.35]} />
          <meshStandardMaterial color="#d5d1c7" roughness={0.9} />
        </mesh>
      ))}

      {/* Core */}
      <mesh position={[0, TOWER_H / 2, 0]} castShadow>
        <boxGeometry args={[3.4, TOWER_H, 3.4]} />
        <meshStandardMaterial color="#b7b1a5" roughness={0.85} />
      </mesh>

      {/* Champagne corner blades */}
      {[
        [TOWER_W / 2, TOWER_D / 2],
        [-TOWER_W / 2, TOWER_D / 2],
        [TOWER_W / 2, -TOWER_D / 2],
        [-TOWER_W / 2, -TOWER_D / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, PODIUM_TOP + SHAFT_H / 2, z]}>
          <boxGeometry args={[0.55, SHAFT_H, 0.55]} />
          <meshStandardMaterial color="#e3d9c2" roughness={0.55} />
        </mesh>
      ))}

      {/* Gold crown edge lighting */}
      <mesh position={[0, TOWER_H + 0.12, 0]}>
        <boxGeometry args={[TOWER_W + 0.5, 0.1, TOWER_D + 0.5]} />
        <meshStandardMaterial
          color="#C8A86B"
          metalness={0.8}
          roughness={0.3}
          emissive="#C8A86B"
          emissiveIntensity={0.35}
        />
      </mesh>
      {[
        [TOWER_W / 2, TOWER_D / 2],
        [-TOWER_W / 2, TOWER_D / 2],
        [TOWER_W / 2, -TOWER_D / 2],
        [-TOWER_W / 2, -TOWER_D / 2],
      ].map(([x, z], i) => (
        <mesh key={`gl-${i}`} position={[x, TOWER_H - FLOOR_H * 1.5, z]}>
          <boxGeometry args={[0.12, FLOOR_H * 3, 0.12]} />
          <meshStandardMaterial
            color="#C8A86B"
            emissive="#e9b96b"
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}

      {/* Podium with dark storefront glazing and plaza */}
      <mesh position={[0, PODIUM_TOP / 2, 0]} castShadow>
        <boxGeometry args={[14, PODIUM_TOP, 14]} />
        <meshStandardMaterial color="#e3d9c2" roughness={0.7} />
      </mesh>
      <mesh position={[0, FLOOR_H * 0.55, 0]}>
        <boxGeometry args={[14.12, FLOOR_H, 14.12]} />
        <meshStandardMaterial
          color="#2b3138"
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[20, 40]} />
        <meshStandardMaterial color="#eae6dc" roughness={1} />
      </mesh>

      {/* Focus apartment: warm lit volume that pokes just past the glass so
          its glow reads as a bright band from outside. */}
      <mesh position={[0, FOCUS_Y, 0]}>
        <boxGeometry args={[TOWER_W + 0.18, FLOOR_H - 0.18, TOWER_D + 0.18]} />
        <meshStandardMaterial
          ref={focusGlow}
          color="#f3e2c4"
          emissive="#ffc98a"
          emissiveIntensity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* Dusk windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos} rotation={[0, w.rot, 0]}>
          <planeGeometry args={[0.65, 0.5]} />
          <meshBasicMaterial
            color="#ffc487"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Real building model, auto-fitted into the procedural tower's envelope so
    the camera timeline needs no retuning. Walls still fade at 70%. */
function GlbTower({
  motion,
}: {
  motion: React.MutableRefObject<MotionState>;
}) {
  const { scene } = useGLTF(TOWER_GLB_URL);
  // Materials named like "Walls" fade for the x-ray beat; everything else
  // (windows, structure) stays. Models without named walls fade wholesale.
  const wallMats = useRef<THREE.Material[]>([]);
  const matsRef = useRef<THREE.Material[]>([]);
  const bandRef = useRef<THREE.Mesh>(null);
  const footprintRef = useRef<number | null>(null);
  const bandFitted = useRef(false);
  const object = useMemo(() => {
    const m = scene.clone(true);
    const box = new THREE.Box3().setFromObject(m);
    const size = box.getSize(new THREE.Vector3());
    const scale = TOWER_H / (size.y || 1);
    m.scale.setScalar(scale);
    box.setFromObject(m);
    const center = box.getCenter(new THREE.Vector3());
    m.position.set(-center.x, -box.min.y, -center.z);
    m.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        const cloned = (
          Array.isArray(o.material) ? o.material : [o.material]
        ).map((mm: THREE.Material) => mm.clone());
        o.material = Array.isArray(o.material) ? cloned : cloned[0];
      }
    });
    return m;
  }, [scene]);

  useFrame(() => {
    // The band can only be sized once both the model (for its footprint)
    // and the band mesh are mounted — ref order makes this the safe spot.
    if (
      !bandFitted.current &&
      footprintRef.current !== null &&
      bandRef.current
    ) {
      const s = (footprintRef.current + 0.25) / (TOWER_W + 0.18);
      bandRef.current.scale.set(s, Math.max(s, 0.5), s);
      bandFitted.current = true;
    }

    const t = smoothstep(0.62, 0.8, motion.current.p);
    const opacity = 1 - t * 0.72;
    const targets = wallMats.current.length
      ? wallMats.current
      : matsRef.current;
    for (const mm of targets) {
      mm.transparent = opacity < 0.999;
      mm.opacity = opacity;
      mm.depthWrite = opacity > 0.6;
    }
  });

  return (
    <group>
      <primitive
        object={object}
        ref={(node: THREE.Object3D | null) => {
          if (!node) return;
          const mats: THREE.Material[] = [];
          const walls: THREE.Material[] = [];
          node.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              (Array.isArray(o.material) ? o.material : [o.material]).forEach(
                (mm: THREE.Material) => {
                  mats.push(mm);
                  if (/wall/i.test(mm.name)) walls.push(mm);
                  // Untextured window materials often ship saturated flat
                  // colors — warm them to the dusk palette instead.
                  if (
                    /window|glass/i.test(mm.name) &&
                    mm instanceof THREE.MeshStandardMaterial &&
                    !mm.map
                  ) {
                    mm.color.set("#e9d3ac");
                    mm.emissive.set("#dfa96e");
                    mm.emissiveIntensity = 0.45;
                    mm.metalness = 0.4;
                    mm.roughness = 0.25;
                  } else if (mm instanceof THREE.MeshStandardMaterial) {
                    // Baked textures ship fully rough — give them speculars
                    // without drowning the texture in warm reflections.
                    mm.roughness = Math.min(mm.roughness, 0.7);
                    mm.metalness = Math.max(mm.metalness, 0.08);
                    mm.envMapIntensity = 1.15;
                  }
                },
              );
            }
          });
          matsRef.current = mats;
          wallMats.current = walls;

          // Adapt the shared rig to the model's real footprint: pull the
          // camera in on close beats and shrink the glow band to hug it.
          const box = new THREE.Box3().setFromObject(node);
          const size = box.getSize(new THREE.Vector3());
          const footprint = Math.max(size.x, size.z);
          fitState.value = Math.min(Math.max(footprint / TOWER_W, 0.4), 1);
          footprintRef.current = footprint;
        }}
      />
      {/* Focus-floor glow still marks the selected residence; rescaled to
          the model's footprint once it loads. */}
      <mesh ref={bandRef} position={[0, FOCUS_Y, 0]}>
        <boxGeometry args={[TOWER_W + 0.18, FLOOR_H - 0.18, TOWER_D + 0.18]} />
        <meshStandardMaterial
          color="#f3e2c4"
          emissive="#ffc98a"
          emissiveIntensity={0.9}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

class GlbBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Uses the real GLB when it exists in public/models, else the procedural
    Tremont-styled tower. */
function TowerSwitch({
  motion,
}: {
  motion: React.MutableRefObject<MotionState>;
}) {
  const [hasGlb, setHasGlb] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(TOWER_GLB_URL, { method: "HEAD" })
      .then((r) => {
        if (alive && r.ok) {
          // Kick the download immediately so the swap from the procedural
          // stand-in happens during the intro push, not mid-scroll.
          useGLTF.preload(TOWER_GLB_URL);
          setHasGlb(true);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!hasGlb) return <Tower motion={motion} />;
  return (
    <GlbBoundary fallback={<Tower motion={motion} />}>
      <Suspense fallback={<Tower motion={motion} />}>
        <GlbTower motion={motion} />
      </Suspense>
    </GlbBoundary>
  );
}

function City() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 200;
  const data = useMemo(() => {
    const rng = (() => {
      let s = 1337;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    const items: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const posV = new THREE.Vector3();
    let placed = 0;
    let guard = 0;
    while (placed < COUNT && guard++ < 2000) {
      const gx = Math.floor(rng() * 16) - 8;
      const gz = Math.floor(rng() * 16) - 8;
      if (Math.abs(gx) < 2 && Math.abs(gz) < 2) continue; // tower plot + park
      const x = gx * 17 + (rng() - 0.5) * 4;
      const z = gz * 17 + (rng() - 0.5) * 4;
      const h = 3 + rng() * rng() * 13;
      const w = 5 + rng() * 5;
      const d = 5 + rng() * 5;
      posV.set(x, h / 2, z);
      scale.set(w, h, d);
      items.push({
        m: m.clone().compose(posV, q, scale),
        c: new THREE.Color("#d6d4cd").offsetHSL(0, 0, (rng() - 0.5) * 0.06),
      });
      placed++;
    }
    return items;
  }, []);

  return (
    <instancedMesh
      ref={(node) => {
        ref.current = node;
        if (!node) return;
        data.forEach((it, i) => {
          node.setMatrixAt(i, it.m);
          node.setColorAt(i, it.c);
        });
        node.instanceMatrix.needsUpdate = true;
        if (node.instanceColor) node.instanceColor.needsUpdate = true;
      }}
      args={[undefined, undefined, data.length]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d9d6cd" roughness={0.95} />
    </instancedMesh>
  );
}

function Trees() {
  const COUNT = 110;
  const data = useMemo(() => {
    const rng = (() => {
      let s = 777;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const items: THREE.Matrix4[] = [];
    for (let i = 0; i < COUNT; i++) {
      // Park ring around the tower plus roadside scatter.
      const ring = rng() < 0.55;
      const r = ring ? 12 + rng() * 12 : 30 + rng() * 90;
      const a = rng() * Math.PI * 2;
      const s = 0.8 + rng() * 1;
      items.push(
        m
          .clone()
          .compose(
            new THREE.Vector3(Math.cos(a) * r, s * 0.9, Math.sin(a) * r),
            q,
            new THREE.Vector3(s * 1.4, s * 1.8, s * 1.4),
          ),
      );
    }
    return items;
  }, []);
  return (
    <instancedMesh
      ref={(node) => {
        if (!node) return;
        data.forEach((mat, i) => node.setMatrixAt(i, mat));
        node.instanceMatrix.needsUpdate = true;
      }}
      args={[undefined, undefined, data.length]}
    >
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#7f9370" roughness={1} />
    </instancedMesh>
  );
}

function Mountains() {
  const cones = useMemo(() => {
    const rng = (() => {
      let s = 99;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    return Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + rng() * 0.3;
      const r = 215 + rng() * 45;
      return {
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r] as [number, number, number],
        h: 14 + rng() * 16,
        w: 34 + rng() * 30,
      };
    });
  }, []);
  return (
    <>
      {cones.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <coneGeometry args={[c.w, c.h, 5]} />
          <meshStandardMaterial color="#c7cbd1" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rng = (() => {
      let s = 2024;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    const arr = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) {
      arr[i * 3] = (rng() - 0.5) * 130;
      arr[i * 3 + 1] = rng() * 42;
      arr[i * 3 + 2] = (rng() - 0.5) * 130;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.008;
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.8;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fff4e0"
        size={0.4}
        sizeAttenuation
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </points>
  );
}

function SkyDome() {
  const shader = useMemo(
    () => ({
      uniforms: {},
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        void main() {
          float h = normalize(vPos).y;
          vec3 horizon = vec3(0.965, 0.815, 0.62);
          vec3 mid = vec3(0.91, 0.85, 0.78);
          vec3 top = vec3(0.72, 0.79, 0.85);
          vec3 col = mix(horizon, mid, smoothstep(0.0, 0.18, h));
          col = mix(col, top, smoothstep(0.18, 0.6, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
    [],
  );
  return (
    <mesh>
      <sphereGeometry args={[460, 24, 16]} />
      <shaderMaterial args={[shader]} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

function Roads() {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 12]}>
        <planeGeometry args={[300, 6.5]} />
        <meshStandardMaterial color="#41464d" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-12, 0, 0]}>
        <planeGeometry args={[300, 6.5]} />
        <meshStandardMaterial color="#41464d" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function ExperienceScene({
  motion,
}: {
  motion: React.MutableRefObject<MotionState>;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.5, far: 900, position: [64, 10, 88] }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
    >
      <fog attach="fog" args={["#ecdfcd", 60, 300]} />
      <hemisphereLight args={["#f6e8d6", "#b8b2a4", 0.7]} />
      <ambientLight intensity={0.14} />
      {/* Warm sunset key with crisper shadows */}
      <directionalLight
        position={[95, 34, 42]}
        intensity={2.4}
        color="#ffc98f"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-far={260}
      />
      {/* Cool rim from the shadow side separates the tower from the sky */}
      <directionalLight
        position={[-70, 32, -55]}
        intensity={0.85}
        color="#dfe4f5"
      />
      {/* Architectural uplight washing the podium */}
      <pointLight
        position={[9, 2.5, 11]}
        intensity={22}
        distance={45}
        decay={2}
        color="#ffb677"
      />

      {/* Procedural sunset reflections for the glass — fully offline. */}
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={2.2}
          color="#ffd9a6"
          position={[10, 2, 8]}
          scale={[18, 4, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#cdd8e2"
          position={[0, 12, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[20, 20, 1]}
        />
      </Environment>

      <SkyDome />
      <Particles />
      <Mountains />
      <City />
      <Trees />
      <Roads />
      <TowerSwitch motion={motion} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[320, 48]} />
        <meshStandardMaterial color="#e7e4db" roughness={1} />
      </mesh>

      {/* Soft grounding under the tower; keeps re-baking through the GLB
          swap window, then freezes. */}
      <ContactShadows
        position={[0, 0.04, 0]}
        scale={55}
        far={32}
        blur={2.2}
        opacity={0.42}
        resolution={512}
        frames={240}
        color="#4a4238"
      />

      <CameraRig motion={motion} />

      <EffectComposer multisampling={4}>
        {/* Threshold sits above the sky horizon so only emissive windows
            and gold accents bloom — never the sky band. */}
        <Bloom
          mipmapBlur
          intensity={0.3}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.14}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.32} />
      </EffectComposer>
    </Canvas>
  );
}
