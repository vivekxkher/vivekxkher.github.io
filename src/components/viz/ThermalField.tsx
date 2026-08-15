"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  LAYER_COUNT,
  layerBounds,
  layerExposure,
  layerPhases,
  layerSolidity,
} from "./shared/envelope";
import { HASH, NOISE, POINT_MASK, THERMAL_RAMP } from "./shared/glsl";
import { smoothPointer, type PointerField } from "./shared/usePointerField";
import { useAreaBudget, useVizEnv } from "./shared/VizCanvas";

export interface ThermalControls {
  /** 0 before the visitor engages, 1 once the field is fully energised. */
  reveal: number;
  /** Section scroll progress, 0…1. */
  progress: number;
  /** Exterior temperature level, 0…1. */
  exterior: number;
}

interface ThermalFieldProps {
  pointer: RefObject<PointerField>;
  controls: RefObject<ThermalControls>;
  /** Particle budget before device scaling. */
  count?: number;
  /** Overall brightness of the particle field. */
  opacity?: number;
}

const COMMON_MAPPING = /* glsl */ `
uniform float uBounds[${LAYER_COUNT + 1}];
uniform float uPhases[${LAYER_COUNT + 1}];
uniform float uSolidity[${LAYER_COUNT}];
uniform float uExposure[${LAYER_COUNT}];
`;

const PARTICLE_VERT = /* glsl */ `
${COMMON_MAPPING}
uniform float uTime;
uniform vec2  uPointer;
uniform float uEngage;
uniform float uReveal;
uniform float uExterior;
uniform float uAspect;
uniform float uPixelRatio;
uniform float uSize;

varying float vTemp;
varying float vAlpha;

${HASH}
${NOISE}

void main() {
  float phase = position.x;
  float lane  = position.y;
  float vary  = position.z;

  // Conserved flux: every carrier advances through resistance at the same
  // rate, so the time spent in a layer is set purely by that layer's
  // resistance. A shared rate also means the seeded spatial distribution is
  // translated rather than remixed, and never drifts into a pile-up.
  float u = fract(uTime * 0.03 + phase);

  // Walk the layer table, picking up position and solidity together.
  float x = uBounds[${LAYER_COUNT}];
  float solid = 0.0;
  float exposure = 1.0;
  for (int i = 0; i < ${LAYER_COUNT}; i++) {
    if (u >= uPhases[i] && u < uPhases[i + 1]) {
      float f = (u - uPhases[i]) / max(uPhases[i + 1] - uPhases[i], 1e-6);
      x = mix(uBounds[i], uBounds[i + 1], f);
      solid = uSolidity[i];
      exposure = uExposure[i];
    }
  }

  // Diffusion: lateral wander, damped inside solid layers.
  float diffusivity = mix(1.0, 0.16, solid);
  float wander = fbm(vec2(x * 4.0 + phase * 17.0, uTime * 0.06 + lane * 23.0)) - 0.5;
  float y = lane + wander * 0.22 * diffusivity + vary * 0.004;

  // The ventilated cavity carries heat upward; carriers keep the offset.
  float cavityRise = clamp(
    (u - uPhases[2]) / max(uPhases[3] - uPhases[2], 1e-6), 0.0, 1.0);
  y -= cavityRise * 0.15 * uReveal;

  y = fract(y);

  // The pointer is a local heat source on whichever layer it sits over.
  vec2 d = (vec2(x, y) - uPointer) * vec2(uAspect, 1.0);
  float heat = exp(-dot(d, d) * 44.0) * uEngage;

  // Temperature falls in proportion to the resistance already crossed —
  // which is exactly the phase coordinate.
  // Warm white is the top of the ordinary range; ember is reserved for the
  // heat the visitor adds, so the field never reads as fire.
  float base = (1.0 - u) * mix(0.44, 0.72, uExterior);
  vTemp = clamp(base * mix(0.4, 1.0, uReveal) + heat * 0.42, 0.0, 1.0);

  // Cold carriers stay quiet; energy is what makes them legible.
  vAlpha = mix(1.0, 0.72, solid)
         * mix(0.28, 1.0, uReveal)
         * (0.24 + vTemp * 0.95)
         * exposure;

  gl_PointSize = uSize * uPixelRatio * (0.66 + vTemp * 0.7)
               * mix(0.75, 1.0, uReveal) * (1.0 + heat * 0.55);
  gl_Position = vec4(vec2(x, 1.0 - y) * 2.0 - 1.0, 0.0, 1.0);
}
`;

const PARTICLE_FRAG = /* glsl */ `
precision mediump float;

uniform float uOpacity;

varying float vTemp;
varying float vAlpha;

${POINT_MASK}
${THERMAL_RAMP}

void main() {
  // A tight falloff: at two or three pixels across, a soft one would eat
  // almost all of a carrier's brightness before it reached the screen.
  float mask = pointMask(gl_PointCoord, 0.4);
  if (mask <= 0.002) discard;
  gl_FragColor = vec4(thermalRamp(vTemp) * mask * vAlpha * uOpacity, 1.0);
}
`;

const FIELD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const FIELD_FRAG = /* glsl */ `
precision mediump float;
${COMMON_MAPPING}
uniform vec2  uPointer;
uniform float uEngage;
uniform float uReveal;
uniform float uExterior;
uniform float uAspect;

varying vec2 vUv;

${THERMAL_RAMP}

void main() {
  float x = vUv.x;
  float y = 1.0 - vUv.y;

  // Invert the mapping: how much resistance lies to the left of this point.
  float u = 1.0;
  for (int i = 0; i < ${LAYER_COUNT}; i++) {
    if (x >= uBounds[i] && x < uBounds[i + 1]) {
      float f = (x - uBounds[i]) / max(uBounds[i + 1] - uBounds[i], 1e-6);
      u = mix(uPhases[i], uPhases[i + 1], f);
    }
  }

  vec2 d = (vec2(x, y) - uPointer) * vec2(uAspect, 1.0);
  float heat = exp(-dot(d, d) * 12.0) * uEngage;

  float temp = clamp((1.0 - u) * mix(0.5, 1.0, uExterior) + heat * 0.7, 0.0, 1.0);

  // Keep it atmospheric: a wash, never a poster.
  float vignette = smoothstep(1.15, 0.15, length(vUv - 0.5) * 1.35);
  float strength = (0.05 + heat * 0.11) * uReveal * vignette;

  gl_FragColor = vec4(thermalRamp(temp) * strength, strength);
}
`;

function makeUniforms(opacity: number) {
  return {
    uBounds: { value: layerBounds },
    uPhases: { value: layerPhases },
    uSolidity: { value: layerSolidity },
    uExposure: { value: layerExposure },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uEngage: { value: 0 },
    uReveal: { value: 0 },
    uExterior: { value: 0.5 },
    uAspect: { value: 1 },
    uPixelRatio: { value: 1 },
    uSize: { value: 3.2 },
    uOpacity: { value: opacity },
  };
}

export function ThermalField({
  pointer,
  controls,
  count = 26000,
  opacity = 0.7,
}: ThermalFieldProps) {
  const { animate } = useVizEnv();
  const { size, gl } = useThree();

  const particleCount = useAreaBudget(count);

  const geometry = useMemo(() => {
    const seeds = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Seeded uniformly in phase — the steady state for a conserved flux.
      // Brightness compensation in the shader keeps the exposure even.
      seeds[i * 3] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(seeds, 3));
    return geom;
  }, [particleCount]);

  // Each material owns its uniforms. Writing through the material ref rather
  // than a shared object is what guarantees the values actually land.
  const particleUniforms = useMemo(() => makeUniforms(opacity), [opacity]);
  const fieldUniforms = useMemo(() => makeUniforms(opacity), [opacity]);

  const particleMat = useRef<THREE.ShaderMaterial>(null);
  const fieldMat = useRef<THREE.ShaderMaterial>(null);

  const clock = useRef(0);
  const engage = useRef(0);
  const reveal = useRef(0);
  const exterior = useRef(0.5);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 24);
    if (animate) clock.current += dt;

    const p = pointer.current;
    smoothPointer(p, dt, 5.5);

    // With the loop idle there is no easing to be had — snap, so the field is
    // shown fully settled rather than caught at the start of a transition.
    const ease = (rate: number) => (animate ? Math.min(1, dt * rate) : 1);

    const targetEngage = p.everMoved ? p.engagement : 0;
    engage.current += (targetEngage - engage.current) * ease(3.2);

    const c = controls.current;
    reveal.current += (c.reveal - reveal.current) * ease(2.4);
    exterior.current += (c.exterior - exterior.current) * ease(3);

    const aspect = size.width / Math.max(size.height, 1);
    const dpr = gl.getPixelRatio();

    for (const mat of [particleMat.current, fieldMat.current]) {
      if (!mat) continue;
      const u = mat.uniforms;
      u.uTime.value = clock.current;
      u.uPointer.value.set(p.sx, p.sy);
      u.uEngage.value = engage.current;
      u.uReveal.value = reveal.current;
      u.uExterior.value = exterior.current;
      u.uAspect.value = aspect;
      u.uPixelRatio.value = dpr;
    }
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={fieldMat}
          vertexShader={FIELD_VERT}
          fragmentShader={FIELD_FRAG}
          uniforms={fieldUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <points frustumCulled={false} geometry={geometry}>
        <shaderMaterial
          ref={particleMat}
          vertexShader={PARTICLE_VERT}
          fragmentShader={PARTICLE_FRAG}
          uniforms={particleUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
