"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { HASH, NOISE, POINT_MASK } from "./shared/glsl";
import { useAreaBudget, useVizEnv } from "./shared/VizCanvas";

export interface PecletControls {
  /** 0 = pure diffusion, 1 = pure advection. */
  ratio: number;
}

const VERT = /* glsl */ `
uniform float uTime;
uniform float uRatio;
uniform float uPixelRatio;
uniform float uSize;

varying float vOrder;
varying float vAlpha;

${HASH}
${NOISE}

void main() {
  float phase = position.x;
  float lane  = position.y;
  float vary  = position.z;

  float adv = uRatio;
  float dif = 1.0 - uRatio;

  // Advection: an ordered drift, identical for every carrier.
  float drift = uTime * 0.075 * adv;

  // Diffusion: a smooth random walk, unique to each carrier.
  float walkX = fbm(vec2(phase * 41.0 + 3.0, uTime * 0.09 + vary * 11.0)) - 0.5;
  float walkY = fbm(vec2(phase * 67.0 + 19.0, uTime * 0.08 + vary * 23.0)) - 0.5;

  float x = fract(phase + drift + walkX * 0.55 * dif);

  // Lanes tighten as advection takes over, so order becomes visible.
  float laneSnap = mix(lane, floor(lane * 9.0) / 9.0 + 0.055, adv * 0.85);
  float y = laneSnap + walkY * 0.5 * dif + (vary - 0.5) * 0.012;
  y = clamp(y, 0.03, 0.97);

  vOrder = adv;
  vAlpha = 0.45 + 0.55 * adv;

  gl_PointSize = uSize * uPixelRatio * mix(1.0, 1.25, adv);
  gl_Position = vec4(vec2(x, 1.0 - y) * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;

uniform float uOpacity;

varying float vOrder;
varying float vAlpha;

${POINT_MASK}

void main() {
  float mask = pointMask(gl_PointCoord, 0.4);
  if (mask <= 0.002) discard;

  // Diffusive carriers read blue; ordered transport bleaches toward paper.
  vec3 diffuse = vec3(0.298, 0.478, 0.72);
  vec3 ordered = vec3(0.925, 0.914, 0.890);
  vec3 colour = mix(diffuse, ordered, vOrder);

  gl_FragColor = vec4(colour * mask * vAlpha * uOpacity, 1.0);
}
`;

/**
 * The Péclet number, made draggable.
 *
 * One population of carriers, one control: how much of their motion is
 * ordered drift versus random walk. At low ratio they wander as a cloud; at
 * high ratio they resolve into streaming lanes. Same particles, same field —
 * only the balance changes.
 */
export function PecletTransport({
  controls,
  count = 3400,
}: {
  controls: RefObject<PecletControls>;
  count?: number;
}) {
  const { animate } = useVizEnv();
  const { gl } = useThree();
  const particleCount = useAreaBudget(count);

  const geometry = useMemo(() => {
    const seeds = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      seeds[i * 3] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(seeds, 3));
    return geom;
  }, [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRatio: { value: 0.5 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2.6 },
      uOpacity: { value: 0.95 },
    }),
    [],
  );

  const material = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef(0);
  const ratio = useRef(0.5);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 24);
    if (animate) clock.current += dt;

    ratio.current +=
      (controls.current.ratio - ratio.current) *
      (animate ? Math.min(1, dt * 4) : 1);

    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.current;
    mat.uniforms.uRatio.value = ratio.current;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false} geometry={geometry}>
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
    </points>
  );
}
