"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { HASH, NOISE, POINT_MASK } from "./shared/glsl";
import { useAreaBudget, useVizEnv } from "./shared/VizCanvas";

export interface MoistureControls {
  /** Interior relative humidity, 0…1 of the 20–90 % range. */
  humidity: number;
  /** Where the dew point falls across the build-up, 0…1 left to right. */
  dewPoint: number;
}

/**
 * Vapour diffusion through a porous assembly, magnified.
 *
 * Carriers drift from the humid interior toward the dry exterior along the
 * vapour-pressure gradient — but the drift is slow and the random component
 * is large, which is what diffusion looks like when you watch it. Where the
 * assembly falls below dew point the carriers stop travelling and accumulate,
 * which is the failure this discipline exists to prevent.
 */
const VERT = /* glsl */ `
uniform float uTime;
uniform float uHumidity;
uniform float uDew;
uniform float uPixelRatio;
uniform float uSize;

varying float vCondensed;
varying float vAlpha;

${HASH}
${NOISE}

void main() {
  float phase = position.x;
  float lane  = position.y;
  float vary  = position.z;

  // Drift: right (interior) toward left (exterior). Slow — this is diffusion.
  float travel = fract(phase + uTime * 0.021);
  float x = 1.0 - travel;

  // The random walk that dominates the motion.
  float wx = fbm(vec2(phase * 53.0, uTime * 0.055 + vary * 17.0)) - 0.5;
  float wy = fbm(vec2(phase * 31.0 + 9.0, uTime * 0.05 + lane * 29.0)) - 0.5;

  x += wx * 0.06;
  float y = lane + wy * 0.16;

  // Crossing dew point, the carrier can no longer stay vapour. It slows and
  // gathers at the plane — but only near it. Past the plane the assembly is
  // drying outward, so carriers there keep moving rather than being held.
  float past = smoothstep(uDew + 0.02, uDew - 0.02, x);
  // Squared by multiplication: pow() with a negative base is undefined in
  // GLSL, and this distance is signed.
  float offset = (x - uDew) / 0.055;
  float atPlane = exp(-offset * offset);
  float settleJitter = (hash11(phase * 411.0) - 0.5) * 0.03;

  x = mix(x, uDew + settleJitter, atPlane * 0.72);
  y = mix(y, lane + wy * 0.05, atPlane * 0.55);

  // Liquid where it has gathered, and still liquid on the way out.
  vCondensed = clamp(max(atPlane, past * 0.55), 0.0, 1.0);

  // More moisture in the air means more carriers are visible at all.
  float presence = 0.45 + uHumidity * 0.55;
  vAlpha = presence
         * mix(0.62, 1.0, atPlane)
         * (0.6 + 0.4 * sin(travel * 3.14159265));

  gl_PointSize = uSize * uPixelRatio * mix(1.0, 1.7, atPlane);
  gl_Position = vec4(vec2(x, 1.0 - y) * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;

uniform float uOpacity;

varying float vCondensed;
varying float vAlpha;

${POINT_MASK}

void main() {
  float mask = pointMask(gl_PointCoord, 0.42);
  if (mask <= 0.002) discard;

  // Restrained: vapour is a cool grey, condensate a muted blue — not neon.
  vec3 vapour = vec3(0.50, 0.55, 0.61);
  vec3 liquid = vec3(0.40, 0.58, 0.76);
  vec3 colour = mix(vapour, liquid, vCondensed);

  gl_FragColor = vec4(colour * mask * vAlpha * uOpacity, 1.0);
}
`;

/** The porous matrix the vapour moves through, drawn once behind the carriers. */
const MATRIX_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const MATRIX_FRAG = /* glsl */ `
precision mediump float;

uniform float uDew;
uniform float uAspect;

varying vec2 vUv;

${HASH}

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);

  // A field of pores on a jittered lattice.
  float cell = 0.028;
  vec2 id = floor(p / cell);
  vec2 local = fract(p / cell) - 0.5;
  vec2 jitter = vec2(hash11(dot(id, vec2(1.0, 57.0))),
                     hash11(dot(id, vec2(37.0, 11.0)))) - 0.5;
  float r = 0.16 + hash11(dot(id, vec2(19.0, 7.0))) * 0.16;
  float d = length(local - jitter * 0.5);
  float pore = 1.0 - smoothstep(r, r + 0.1, d);

  float base = 0.085 + pore * 0.11;

  // The cold side of the dew-point plane sits fractionally darker.
  float cold = smoothstep(uDew + 0.06, uDew - 0.06, vUv.x);
  vec3 colour = mix(vec3(0.55, 0.57, 0.60), vec3(0.34, 0.45, 0.58), cold);

  gl_FragColor = vec4(colour * base, base);
}
`;

export function MoistureField({
  controls,
  count = 9000,
}: {
  controls: RefObject<MoistureControls>;
  count?: number;
}) {
  const { animate } = useVizEnv();
  const { gl, size } = useThree();
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

  const particleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHumidity: { value: 0.5 },
      uDew: { value: 0.42 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2.4 },
      uOpacity: { value: 0.9 },
    }),
    [],
  );

  const matrixUniforms = useMemo(
    () => ({
      uDew: { value: 0.42 },
      uAspect: { value: 1.78 },
    }),
    [],
  );

  const particleMat = useRef<THREE.ShaderMaterial>(null);
  const matrixMat = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef(0);
  const humidity = useRef(0.5);
  const dew = useRef(0.42);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 24);
    if (animate) clock.current += dt;

    const target = controls.current;
    const ease = (rate: number) => (animate ? Math.min(1, dt * rate) : 1);
    humidity.current += (target.humidity - humidity.current) * ease(4);
    dew.current += (target.dewPoint - dew.current) * ease(3.5);

    if (particleMat.current) {
      const u = particleMat.current.uniforms;
      u.uTime.value = clock.current;
      u.uHumidity.value = humidity.current;
      u.uDew.value = dew.current;
      u.uPixelRatio.value = gl.getPixelRatio();
    }
    if (matrixMat.current) {
      matrixMat.current.uniforms.uDew.value = dew.current;
      matrixMat.current.uniforms.uAspect.value =
        size.width / Math.max(size.height, 1);
    }
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={matrixMat}
          vertexShader={MATRIX_VERT}
          fragmentShader={MATRIX_FRAG}
          uniforms={matrixUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <points frustumCulled={false} geometry={geometry}>
        <shaderMaterial
          ref={particleMat}
          vertexShader={VERT}
          fragmentShader={FRAG}
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
