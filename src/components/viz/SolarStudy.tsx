"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sunPath, sunPosition } from "@/lib/solar";
import { useVizEnv } from "./shared/VizCanvas";

export interface SolarProps {
  latitude: number;
  /** 0–11 */
  month: number;
  /** Solar time, 0–24 */
  hour: number;
}

const SUN_DISTANCE = 15;

/** The massing under study: a mass, a lower wing, and fins on the west face. */
function Massing() {
  const wall = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8d9299",
        roughness: 0.92,
        metalness: 0,
      }),
    [],
  );
  const wing = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#757a81",
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  useEffect(
    () => () => {
      wall.dispose();
      wing.dispose();
    },
    [wall, wing],
  );

  return (
    <group>
      <mesh position={[-0.6, 1.75, 0]} castShadow receiveShadow material={wall}>
        <boxGeometry args={[3.4, 3.5, 2.8]} />
      </mesh>

      <mesh position={[2.1, 0.85, 0.5]} castShadow receiveShadow material={wing}>
        <boxGeometry args={[2.0, 1.7, 2.2]} />
      </mesh>

      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[-2.45, 0.75 + i * 0.58, 0]}
          castShadow
          receiveShadow
          material={wing}
        >
          <boxGeometry args={[0.8, 0.06, 2.8]} />
        </mesh>
      ))}
    </group>
  );
}

/** A polyline built outside the reconciler, to keep the JSX free of type noise. */
function Polyline({
  points,
  color,
  opacity,
}: {
  points: THREE.Vector3[];
  color: string;
  opacity: number;
}) {
  const object = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
    });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false;
    return line;
  }, [points, color, opacity]);

  useEffect(
    () => () => {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    },
    [object],
  );

  if (points.length < 2) return null;
  return <primitive object={object} />;
}

export function SolarStudy({ latitude, month, hour }: SolarProps) {
  const { tier, animate } = useVizEnv();
  const { camera } = useThree();

  const sunRef = useRef<THREE.DirectionalLight>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const skyRef = useRef<THREE.HemisphereLight>(null);

  const target = useRef({ latitude, month, hour });
  target.current = { latitude, month, hour };
  const smooth = useRef({ latitude, month, hour });

  // The day-track for the selected month, and the annual envelope.
  const trackPoints = useMemo(() => {
    return sunPath(latitude, month)
      .filter((p) => p.altitude > -1.5)
      .map(
        (p) =>
          new THREE.Vector3(
            p.direction[0] * SUN_DISTANCE,
            p.direction[1] * SUN_DISTANCE,
            p.direction[2] * SUN_DISTANCE,
          ),
      );
  }, [latitude, month]);

  const solsticePoints = useMemo(() => {
    const build = (m: number) =>
      sunPath(latitude, m)
        .filter((p) => p.altitude > -1.5)
        .map(
          (p) =>
            new THREE.Vector3(
              p.direction[0] * SUN_DISTANCE,
              p.direction[1] * SUN_DISTANCE,
              p.direction[2] * SUN_DISTANCE,
            ),
        );
    return { june: build(5), december: build(11) };
  }, [latitude]);

  const ringPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.sin(a) * 9, 0.01, Math.cos(a) * 9));
    }
    return points;
  }, []);

  useEffect(() => {
    camera.position.set(15.5, 10.5, 19);
    camera.lookAt(0, 1.2, 0);
  }, [camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const k = animate ? Math.min(1, dt * 7) : 1;
    const s = smooth.current;
    const t = target.current;

    s.latitude += (t.latitude - s.latitude) * k;
    s.month += (t.month - s.month) * k;
    s.hour += (t.hour - s.hour) * k;

    const sun = sunPosition(s.latitude, Math.round(s.month), s.hour);
    const [dx, dy, dz] = sun.direction;

    const light = sunRef.current;
    if (light) {
      light.position.set(
        dx * SUN_DISTANCE,
        Math.max(dy, 0.02) * SUN_DISTANCE,
        dz * SUN_DISTANCE,
      );
      // Intensity follows altitude — a low sun delivers far less energy.
      const alt = Math.max(sun.altitude, 0) / 90;
      light.intensity = sun.up ? 0.2 + Math.pow(alt, 0.6) * 1.9 : 0;
      // and arrives warmer, through more atmosphere.
      light.color.setHSL(0.085, 0.42 * (1 - alt), 0.52 + alt * 0.48);
    }

    const marker = markerRef.current;
    if (marker) {
      marker.position.set(
        dx * SUN_DISTANCE,
        dy * SUN_DISTANCE,
        dz * SUN_DISTANCE,
      );
      marker.visible = sun.up;
    }

    if (skyRef.current) {
      skyRef.current.intensity = sun.up ? 0.85 : 0.25;
    }
  });

  const shadowSize = tier === "high" ? 2048 : 1024;

  return (
    <>
      <color attach="background" args={["#0a0c0e"]} />
      <fog attach="fog" args={["#0a0c0e", 30, 62]} />

      <hemisphereLight ref={skyRef} args={["#6d86a0", "#0e1114", 0.55]} />

      <directionalLight
        ref={sunRef}
        castShadow
        intensity={2.2}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.0012}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={64}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
      />

      <mesh ref={markerRef}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshBasicMaterial color="#f2e9dc" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[54, 54]} />
        <meshStandardMaterial color="#272b30" roughness={1} metalness={0} />
      </mesh>

      <Polyline points={ringPoints} color="#ece9e3" opacity={0.13} />
      <Polyline points={solsticePoints.june} color="#ece9e3" opacity={0.22} />
      <Polyline
        points={solsticePoints.december}
        color="#ece9e3"
        opacity={0.22}
      />
      <Polyline points={trackPoints} color="#4c7db8" opacity={0.62} />

      <Massing />
    </>
  );
}
