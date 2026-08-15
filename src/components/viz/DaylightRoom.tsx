"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ROOM } from "@/lib/daylight";
import { useVizEnv } from "./shared/VizCanvas";

export interface DaylightControls {
  /** Aperture size, 0…1. */
  aperture: number;
  /** Sun altitude in degrees. */
  altitude: number;
}

/**
 * A room in section, lit through one opening.
 *
 * Diffuse light at each point is proportional to the angle the aperture
 * subtends there — the reasoning behind the no-sky line — and the direct beam
 * is the wedge bounded by rays from the two aperture edges. Both are computed
 * per pixel, so the falloff is calculated rather than painted.
 */
const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform float uHead;
uniform float uSill;
uniform float uAltitude;   // radians
uniform float uAspect;
uniform float uTime;

varying vec2 vUv;

const float LEFT   = ${ROOM.left};
const float RIGHT  = ${ROOM.right};
const float TOP    = ${ROOM.top};
const float BOTTOM = ${ROOM.bottom};

float cross2(vec2 a, vec2 b) {
  return a.x * b.y - a.y * b.x;
}

void main() {
  // Screen space with y measured downward, matching the plan of the section.
  vec2 p = vec2(vUv.x, 1.0 - vUv.y);

  float inside = step(LEFT, p.x) * step(p.x, RIGHT)
               * step(TOP, p.y) * step(p.y, BOTTOM);

  // --- Diffuse: the angle the aperture subtends at this point -------------
  // A fixed gain rather than a normalising reference point. Dividing by the
  // value at the window wall saturates the whole room, because a point hard
  // against that wall sees the opening almost edge-on.
  vec2 v1 = normalize(vec2(LEFT - p.x, uHead - p.y) + 1e-6);
  vec2 v2 = normalize(vec2(LEFT - p.x, uSill - p.y) + 1e-6);
  float subtended = acos(clamp(dot(v1, v2), -1.0, 1.0)) / 3.14159265;

  // The subtended angle already falls roughly with distance; the exponent
  // carries it closer to the inverse-square falloff daylight actually shows.
  float diffuse = pow(clamp(subtended * 2.6, 0.0, 1.0), 1.6);

  // --- Direct: the wedge between rays from the two aperture edges ---------
  vec2 dir = normalize(vec2(cos(uAltitude), sin(uAltitude)));
  vec2 a = vec2(LEFT, uHead);
  vec2 b = vec2(LEFT, uSill);
  float sideA = cross2(dir, p - a);
  float sideB = cross2(dir, p - b);
  float ahead = step(0.0, dot(p - a, dir));
  float beam = step(sideA * sideB, 0.0) * ahead;

  // Soften the beam edges a little so it reads as light, not as a polygon.
  float edge = 1.0 - smoothstep(0.0, 0.02, min(abs(sideA), abs(sideB)));
  beam = max(beam, edge * ahead * 0.55);

  float sunUp = step(0.02, uAltitude);
  float direct = beam * sunUp * (0.35 + 0.65 * sin(clamp(uAltitude, 0.0, 1.5707963)));

  float light = clamp(diffuse * 0.95 + direct * 0.7, 0.0, 1.5);

  // Warm daylight, cooling slightly in the depth of the room.
  vec3 warm = vec3(0.96, 0.94, 0.90);
  vec3 cool = vec3(0.46, 0.55, 0.66);
  vec3 colour = mix(cool, warm, clamp(light * 0.7, 0.0, 1.0));

  float intensity = inside * clamp(light, 0.0, 1.5) * 0.42;

  // A whisper of grain, so large flat washes do not band.
  float grain = fract(sin(dot(vUv * 800.0, vec2(12.9898, 78.233))) * 43758.5453);
  intensity *= 0.97 + grain * 0.06;

  gl_FragColor = vec4(colour * intensity, intensity);
}
`;

export function DaylightRoom({
  controls,
}: {
  controls: RefObject<DaylightControls>;
}) {
  const { animate } = useVizEnv();
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uHead: { value: 0.26 },
      uSill: { value: 0.5 },
      uAltitude: { value: 0.7 },
      uAspect: { value: 1.78 },
      uTime: { value: 0 },
    }),
    [],
  );

  const material = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef(0);
  const head = useRef(0.26);
  const sill = useRef(0.5);
  const altitude = useRef(0.7);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 24);
    if (animate) clock.current += dt;

    const target = controls.current;
    const height = ROOM.bottom - ROOM.top;
    const targetHead = ROOM.top + height * 0.1;
    const targetSill = Math.min(
      targetHead + height * (0.18 + target.aperture * 0.62),
      ROOM.bottom - height * 0.04,
    );
    const targetAlt = (target.altitude * Math.PI) / 180;

    const k = animate ? Math.min(1, dt * 5) : 1;
    head.current += (targetHead - head.current) * k;
    sill.current += (targetSill - sill.current) * k;
    altitude.current += (targetAlt - altitude.current) * k;

    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uHead.value = head.current;
    mat.uniforms.uSill.value = sill.current;
    mat.uniforms.uAltitude.value = altitude.current;
    mat.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    mat.uniforms.uTime.value = clock.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
