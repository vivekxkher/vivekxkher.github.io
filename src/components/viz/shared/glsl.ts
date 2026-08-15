/**
 * Shared GLSL fragments. Kept as plain strings so they can be concatenated
 * into any shader without a build-step plugin.
 */

/** Cheap deterministic hash — used to give every particle its own character. */
export const HASH = /* glsl */ `
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
`;

/** Value noise + fbm. Smooth, cheap, and stable enough for flow fields. */
export const NOISE = /* glsl */ `
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash11(dot(i, vec2(1.0, 57.0)));
  float b = hash11(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
  float c = hash11(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
  float d = hash11(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}
`;

/**
 * The site's temperature ramp: cool blue → graphite → warm white → ember.
 * Used by every visualisation that shows a scalar field, so that the same
 * colour always means the same thing across the site.
 */
export const THERMAL_RAMP = /* glsl */ `
vec3 thermalRamp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 cold  = vec3(0.157, 0.333, 0.518);
  vec3 cool  = vec3(0.298, 0.478, 0.643);
  vec3 mid   = vec3(0.564, 0.588, 0.615);
  vec3 warm  = vec3(0.925, 0.914, 0.890);
  vec3 hot   = vec3(0.878, 0.545, 0.322);

  vec3 c = mix(cold, cool, smoothstep(0.0, 0.28, t));
  c = mix(c, mid,  smoothstep(0.25, 0.52, t));
  c = mix(c, warm, smoothstep(0.5, 0.78, t));
  c = mix(c, hot,  smoothstep(0.76, 1.0, t));
  return c;
}
`;

/** Soft round point sprite with no texture fetch. */
export const POINT_MASK = /* glsl */ `
float pointMask(vec2 uv, float softness) {
  float d = length(uv - 0.5) * 2.0;
  return 1.0 - smoothstep(1.0 - softness, 1.0, d);
}
`;
