"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Shared, mutated once per frame by the DOM scroll rig in LuxuryExperience.
export type MotionState = { p: number };

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

function Tower({ motion }: { motion: React.MutableRefObject<MotionState> }) {
  const facade = useRef<THREE.MeshPhysicalMaterial>(null);
  const focusGlow = useRef<THREE.MeshStandardMaterial>(null);

  const slabs = useMemo(() => {
    const m = new THREE.Matrix4();
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i <= FLOORS; i++) {
      list.push(m.clone().setPosition(0, i * FLOOR_H, 0));
    }
    return list;
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
      for (let f = 1; f < FLOORS; f++) {
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
      {/* Glass envelope */}
      <mesh position={[0, TOWER_H / 2, 0]} renderOrder={2}>
        <boxGeometry args={[TOWER_W, TOWER_H, TOWER_D]} />
        <meshPhysicalMaterial
          ref={facade}
          color="#9db6c6"
          metalness={0.35}
          roughness={0.08}
          transparent
          opacity={0.62}
          depthWrite={false}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Floor slabs */}
      {slabs.map((m, i) => (
        <mesh
          key={i}
          position={[0, i * FLOOR_H, 0]}
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

      {/* Corner columns */}
      {[
        [TOWER_W / 2, TOWER_D / 2],
        [-TOWER_W / 2, TOWER_D / 2],
        [TOWER_W / 2, -TOWER_D / 2],
        [-TOWER_W / 2, -TOWER_D / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, TOWER_H / 2, z]}>
          <boxGeometry args={[0.4, TOWER_H, 0.4]} />
          <meshStandardMaterial color="#2c3440" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      {/* Gold parapet trim */}
      <mesh position={[0, TOWER_H + 0.12, 0]}>
        <boxGeometry args={[TOWER_W + 0.5, 0.1, TOWER_D + 0.5]} />
        <meshStandardMaterial
          color="#C8A86B"
          metalness={0.8}
          roughness={0.3}
          emissive="#C8A86B"
          emissiveIntensity={0.12}
        />
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
    >
      <fog attach="fog" args={["#ecdfcd", 60, 300]} />
      <hemisphereLight args={["#f6e8d6", "#b8b2a4", 0.75]} />
      <ambientLight intensity={0.16} />
      <directionalLight
        position={[95, 34, 42]}
        intensity={2}
        color="#ffc98f"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-far={260}
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
      <Tower motion={motion} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[320, 48]} />
        <meshStandardMaterial color="#e7e4db" roughness={1} />
      </mesh>

      <CameraRig motion={motion} />
    </Canvas>
  );
}
