"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FloorPlanSvg from "@/components/FloorPlanSvg";

type Keyframe = { position: THREE.Vector3; target: THREE.Vector3 };

const keyframes: Keyframe[] = [
  { position: new THREE.Vector3(0, 3, 16), target: new THREE.Vector3(0, 5, 0) }, // exterior
  { position: new THREE.Vector3(0, 2.5, 6), target: new THREE.Vector3(0, 3, 0) }, // approach
  { position: new THREE.Vector3(0, 2.5, 0.5), target: new THREE.Vector3(0, 3, -4) }, // threshold
  { position: new THREE.Vector3(0, 3, -6), target: new THREE.Vector3(0, 2, -11) }, // inside
  { position: new THREE.Vector3(0, 15, -6), target: new THREE.Vector3(0, 0, -6) }, // rise to plan
];

const labels = [
  { at: 0, text: "The Tower" },
  { at: 0.3, text: "Stepping Inside" },
  { at: 0.62, text: "Inside the Home" },
];

function cameraStateAt(progress: number) {
  const segments = keyframes.length - 1;
  const scaled = progress * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const t = scaled - index;
  const a = keyframes[index];
  const b = keyframes[index + 1];
  return {
    position: new THREE.Vector3().lerpVectors(a.position, b.position, t),
    target: new THREE.Vector3().lerpVectors(a.target, b.target, t),
  };
}

const WIDTH = 8;
const DEPTH = 8;
const HEIGHT = 20;

function TowerShell() {
  const shellEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(WIDTH, HEIGHT, DEPTH)), []);
  const floorEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(WIDTH, DEPTH)), []);

  return (
    <group position={[0, HEIGHT / 2, 0]}>
      <lineSegments geometry={shellEdges}>
        <lineBasicMaterial color="#c9a44c" transparent opacity={0.5} />
      </lineSegments>
      <mesh>
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <meshBasicMaterial color="#c9a44c" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      {Array.from({ length: 15 }).map((_, i) => (
        <lineSegments
          key={i}
          position={[0, -HEIGHT / 2 + (i + 1) * 1.25, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={floorEdges}
        >
          <lineBasicMaterial color="#c9a44c" transparent opacity={0.12} />
        </lineSegments>
      ))}
    </group>
  );
}

function FacadeDoor({ progressRef }: { progressRef: { current: number } }) {
  const fillMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(3, 4)), []);

  useFrame(() => {
    const p = progressRef.current;
    const fade = 1 - Math.min(Math.max((p - 0.42) / 0.2, 0), 1);
    if (fillMaterial.current) fillMaterial.current.opacity = fade * 0.5;
    if (lineMaterial.current) lineMaterial.current.opacity = fade;
  });

  return (
    <group position={[0, 2, DEPTH / 2]}>
      <mesh>
        <planeGeometry args={[3, 4]} />
        <meshBasicMaterial ref={fillMaterial} color="#c9a44c" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={lineMaterial} color="#f2f0ea" transparent opacity={1} />
      </lineSegments>
    </group>
  );
}

function InteriorRooms() {
  const rooms: [number, number, number, number][] = [
    [-2.5, -6, 3, 3],
    [1.5, -6, 3, 3],
    [-2, -9.5, 4, 2],
    [2, -9.5, 3, 2],
  ];
  const floorEdges = useMemo(
    () => rooms.map(([, , w, d]) => new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d))),
    [],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -7]}>
        <planeGeometry args={[WIDTH - 0.6, 8]} />
        <meshBasicMaterial color="#c9a44c" transparent opacity={0.04} />
      </mesh>
      {rooms.map(([x, z], i) => (
        <lineSegments
          key={i}
          position={[x, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={floorEdges[i]}
        >
          <lineBasicMaterial color="#c9a44c" transparent opacity={0.4} />
        </lineSegments>
      ))}
    </group>
  );
}

function Rig({ progressRef }: { progressRef: { current: number } }) {
  const target = useRef(new THREE.Vector3(0, 4, 0));

  useFrame(({ camera, size }) => {
    // On narrow/portrait viewports, widen the FOV so the building doesn't
    // crop against the edges where the labels sit.
    const perspective = camera as THREE.PerspectiveCamera;
    const isNarrow = size.width / size.height < 0.9;
    const targetFov = isNarrow ? 63 : 45;
    if (Math.abs(perspective.fov - targetFov) > 0.05) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, targetFov, 0.1);
      perspective.updateProjectionMatrix();
    }

    const { position, target: lookTarget } = cameraStateAt(progressRef.current);
    camera.position.lerp(position, 0.06);
    target.current.lerp(lookTarget, 0.06);
    camera.lookAt(target.current);
  });

  return null;
}

export default function FlyThroughScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeLabel, setActiveLabel] = useState(0);
  const [started, setStarted] = useState(false);
  const [showPlanCaption, setShowPlanCaption] = useState(false);

  useEffect(() => {
    let frame: number;
    const update = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const progress = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
        progressRef.current = progress;

        let labelIndex = 0;
        for (let i = 0; i < labels.length; i++) {
          if (progress >= labels[i].at) labelIndex = i;
        }
        setActiveLabel((prev) => (prev !== labelIndex ? labelIndex : prev));
        setStarted((prev) => prev || progress > 0.02);
        setShowPlanCaption(progress > 0.85);

        const planOpacity = Math.min(Math.max((progress - 0.82) / 0.16, 0), 1);
        if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = String(1 - planOpacity);
        if (floorPlanRef.current) floorPlanRef.current.style.opacity = String(planOpacity);
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[450vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <div ref={canvasWrapRef} className="absolute inset-0">
          <Canvas camera={{ fov: 45, position: [0, 3, 16] }}>
            <color attach="background" args={["#0a0a0a"]} />
            <fog attach="fog" args={["#0a0a0a", 8, 30]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 12, 5]} intensity={40} color="#c9a44c" />
            <TowerShell />
            <FacadeDoor progressRef={progressRef} />
            <InteriorRooms />
            <Rig progressRef={progressRef} />
          </Canvas>
        </div>

        {/* Scrims keep the top/bottom text bands legible over the model on any screen. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/90 to-transparent sm:h-36" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/90 to-transparent sm:h-56" />

        <div
          ref={floorPlanRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 px-6 opacity-0 sm:gap-4"
        >
          <span className="eyebrow text-xs uppercase text-accent">Digital Twin</span>
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            The Floor Plan
          </h3>
          <FloorPlanSvg className="mt-2 w-[min(80vw,380px)] sm:mt-4 sm:w-[min(70vw,440px)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-20 px-6 text-center sm:top-28 lg:px-12">
          <span
            className={`eyebrow text-xs uppercase text-accent transition-opacity duration-500 ${
              started ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to explore the digital twin
          </span>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-10 px-6 transition-opacity duration-500 sm:bottom-16 lg:px-12 ${
            showPlanCaption ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative mx-auto min-h-[3.5rem] max-w-7xl sm:min-h-[4.5rem]">
            {labels.map((label, i) => (
              <h3
                key={label.text}
                className={`absolute inset-y-0 left-0 flex max-w-[85vw] items-center text-3xl font-semibold leading-tight tracking-tight transition-opacity duration-700 sm:max-w-none sm:text-5xl ${
                  activeLabel === i ? "opacity-100" : "opacity-0"
                }`}
              >
                {label.text}
              </h3>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
