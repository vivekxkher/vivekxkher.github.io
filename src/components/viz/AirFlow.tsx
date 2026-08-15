"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { MASSING_SDF } from "./shared/massing";
import { useAreaBudget, useVizEnv } from "./shared/VizCanvas";

export interface AirControls {
  /** Wind direction in radians, 0 = left to right. */
  angle: number;
  /** 0…1, how open the building is. */
  porosity: number;
}

/**
 * Streamlines around and through a building.
 *
 * Each carrier is drawn as a short segment of its own streamline: the two ends
 * are the same seed point integrated to two nearby times, so the segment lies
 * along the flow and its length is proportional to local speed. Round dots
 * cannot show direction in a still frame; these can.
 *
 * The sweep is signed and centred on the seed — from minus half a lifetime to
 * plus half — which keeps the frame evenly populated. An integration that only
 * ran forward would empty the upwind side within one lifetime.
 *
 * The field is built from the massing's signed distance function: flow cannot
 * drive into a solid, accelerates tangentially around corners, and stalls
 * where a surface faces away from the wind.
 */
const VERT = /* glsl */ `
uniform float uTime;
uniform vec2  uWind;
uniform float uPorosity;

attribute float aEnd;

varying float vSpeed;
varying float vAlpha;

const int STEPS = 13;
const float LIFETIME = 3.2;
const float SPEED = 0.32;
const float TRAIL = 0.2;

${MASSING_SDF}

// Forward-difference gradient, reusing the distance already in hand: three
// field evaluations per normal instead of four.
vec2 sdNormal(vec2 p, float d0) {
  vec2 e = vec2(0.004, 0.0);
  vec2 n = vec2(
    sdMassing(p + e.xy, uPorosity) - d0,
    sdMassing(p + e.yx, uPorosity) - d0
  );
  float len = length(n);
  return len > 1e-5 ? n / len : vec2(0.0, 1.0);
}

vec2 flow(vec2 p) {
  float d = sdMassing(p, uPorosity);

  // Far field is simply the wind. Skipping the gradient here is what makes
  // integrating a whole field of streamlines affordable.
  if (d > 0.17) return uWind;

  vec2 n = sdNormal(p, d);

  // Inside a solid there is no flow worth drawing; drift outward so a carrier
  // seeded in the wall leaves rather than sitting there.
  if (d < 0.0) return n * 0.3;

  vec2 v = uWind;

  // Close to a surface, cancel the component driving into it and let what is
  // left speed up along the face.
  float influence = exp(-d * 22.0);
  float into = min(dot(v, n), 0.0);
  v -= n * into * (1.0 + influence * 0.9);

  vec2 tangent = vec2(-n.y, n.x);
  float side = dot(tangent, uWind) >= 0.0 ? 1.0 : -1.0;
  v += tangent * side * influence * 0.6;

  // Leeward stall. A face whose normal points downwind is in the lee, so the
  // sign here is positive: n pointing with the wind means sheltered.
  float lee = clamp(dot(n, uWind), 0.0, 1.0);
  v *= 1.0 - lee * influence * 0.88;

  return v;
}

vec2 integrate(vec2 seed, float tau) {
  float h = tau / float(STEPS);
  vec2 p = seed;
  for (int i = 0; i < STEPS; i++) {
    // Midpoint step — cheap, and it holds the line around a corner where
    // plain Euler would cut straight through the façade.
    vec2 k1 = flow(p);
    vec2 k2 = flow(p + k1 * h * SPEED * 0.5);
    p += k2 * h * SPEED;
  }
  return p;
}

void main() {
  vec2 seed = position.xy;
  float phase = position.z;

  float life = fract(uTime / LIFETIME + phase);
  float tau = (life - 0.5) * LIFETIME;

  vec2 p = integrate(seed, tau + aEnd * TRAIL);

  vec2 v = flow(p);
  vSpeed = clamp(length(v), 0.0, 1.7);

  // Brightest at the seed, fading toward both ends of the sweep.
  vAlpha = clamp(cos(tau / LIFETIME * 3.14159265), 0.0, 1.0);

  // Hide anything that ended up inside the massing or outside the frame.
  if (sdMassing(p, uPorosity) < 0.0) vAlpha = 0.0;
  if (p.x < -0.03 || p.x > 1.03 || p.y < -0.03 || p.y > 1.03) vAlpha = 0.0;

  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;

uniform float uOpacity;

varying float vSpeed;
varying float vAlpha;

void main() {
  if (vAlpha <= 0.004) discard;

  // Slow air reads blue and quiet; fast air bleaches toward paper.
  vec3 slow = vec3(0.20, 0.36, 0.55);
  vec3 fast = vec3(0.94, 0.93, 0.90);
  vec3 colour = mix(slow, fast, clamp((vSpeed - 0.5) * 1.6, 0.0, 1.0));

  gl_FragColor = vec4(colour * vAlpha * uOpacity, 1.0);
}
`;

export function AirFlow({
  controls,
  count = 2200,
}: {
  controls: RefObject<AirControls>;
  count?: number;
}) {
  const { animate } = useVizEnv();
  const lineCount = useAreaBudget(count);

  const geometry = useMemo(() => {
    // Two vertices per carrier: the same seed at two nearby times.
    const seeds = new Float32Array(lineCount * 2 * 3);
    const ends = new Float32Array(lineCount * 2);

    for (let i = 0; i < lineCount; i++) {
      const x = Math.random();
      const y = Math.random();
      const phase = Math.random();
      for (let k = 0; k < 2; k++) {
        const v = (i * 2 + k) * 3;
        seeds[v] = x;
        seeds[v + 1] = y;
        seeds[v + 2] = phase;
        ends[i * 2 + k] = k;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(seeds, 3));
    geom.setAttribute("aEnd", new THREE.BufferAttribute(ends, 1));
    return geom;
  }, [lineCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWind: { value: new THREE.Vector2(1, 0) },
      uPorosity: { value: 0.6 },
      uOpacity: { value: 0.6 },
    }),
    [],
  );

  const material = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef(0);
  const angle = useRef(0);
  const porosity = useRef(0.6);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 24);
    if (animate) clock.current += dt;

    const target = controls.current;
    // Interpolate along the shortest arc so the field never spins the wrong way.
    const ease = animate ? Math.min(1, dt * 4) : 1;
    let diff = target.angle - angle.current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    angle.current += diff * ease;
    porosity.current += (target.porosity - porosity.current) * ease;

    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.current;
    mat.uniforms.uWind.value.set(
      Math.cos(angle.current),
      Math.sin(angle.current),
    );
    mat.uniforms.uPorosity.value = porosity.current;
  });

  return (
    <lineSegments frustumCulled={false} geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
