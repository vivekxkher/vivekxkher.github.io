/**
 * A deliberately simple two-dimensional daylight model, used by both the
 * shader and the plotted floor curve so the drawing and the graph agree.
 *
 * Diffuse light at a point is taken as proportional to the angle the aperture
 * subtends there — the "sky view" reasoning behind the no-sky line. That is a
 * relative measure of daylight availability, not an illuminance in lux, and
 * nothing here is calibrated against a real sky.
 */

export const ROOM = {
  /** Interior face of the window wall. */
  left: 0.08,
  /** Back wall. */
  right: 0.92,
  /** Ceiling (screen coordinates, y increases downward). */
  top: 0.14,
  /** Floor. The plot of the floor curve sits underneath. */
  bottom: 0.72,
};

export interface Aperture {
  /** Top edge, as a fraction of room height from the ceiling. */
  head: number;
  /** Bottom edge. */
  sill: number;
}

/** Aperture edges in screen coordinates, from a 0…1 size control. */
export function apertureFor(size: number): Aperture {
  const height = ROOM.bottom - ROOM.top;
  // The head stays high — position matters more than area.
  const head = ROOM.top + height * 0.1;
  const sill = head + height * (0.18 + size * 0.62);
  return { head, sill: Math.min(sill, ROOM.bottom - height * 0.04) };
}

/** Angle subtended by the aperture at a point — the relative sky view. */
export function skyView(x: number, y: number, aperture: Aperture): number {
  const ax = ROOM.left;
  const v1x = ax - x;
  const v1y = aperture.head - y;
  const v2x = ax - x;
  const v2y = aperture.sill - y;

  const l1 = Math.hypot(v1x, v1y);
  const l2 = Math.hypot(v2x, v2y);
  if (l1 < 1e-6 || l2 < 1e-6) return 1;

  const cos = (v1x * v2x + v1y * v2y) / (l1 * l2);
  return Math.acos(Math.min(Math.max(cos, -1), 1)) / Math.PI;
}

/**
 * Sample the floor curve, normalised to its own peak.
 *
 * Normalising against a fixed point just inside the window looks natural and
 * is wrong: a point on the floor hard against the window wall sees the
 * aperture almost edge-on, so that reference is close to zero and everything
 * divided by it saturates. The brightest point on the floor sits a little way
 * into the room, so the peak is the honest datum.
 */
export function floorCurve(aperture: Aperture, samples = 48) {
  const raw: { x: number; value: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = ROOM.left + ((ROOM.right - ROOM.left) * i) / samples;
    // Same gain and exponent the shader applies, so the plotted curve and the
    // rendered room are two views of one calculation rather than two guesses.
    const view = Math.min(skyView(x, ROOM.bottom, aperture) * 2.6, 1);
    raw.push({ x, value: Math.pow(view, 1.6) });
  }

  const peak = raw.reduce((max, p) => Math.max(max, p.value), 0);
  if (peak < 1e-6) return raw.map((p) => ({ ...p, value: 0 }));
  return raw.map((p) => ({ x: p.x, value: p.value / peak }));
}

/** Relative daylight at one point on the floor, on the same 0–1 scale. */
export function floorDaylight(x: number, aperture: Aperture): number {
  const curve = floorCurve(aperture, 96);
  let nearest = curve[0];
  for (const point of curve) {
    if (Math.abs(point.x - x) < Math.abs(nearest.x - x)) nearest = point;
  }
  return nearest.value;
}

/**
 * Uniformity: the level at the back of the room as a fraction of the peak.
 *
 * More useful than "how far light reaches", which for a high window is almost
 * always the full depth and therefore tells you nothing. Evenness is the thing
 * that actually decides whether the back of a room is usable.
 */
export function uniformity(aperture: Aperture): number {
  const curve = floorCurve(aperture, 96);
  const peak = curve.reduce((max, p) => Math.max(max, p.value), 0);
  if (peak < 1e-6) return 0;
  return curve[curve.length - 1].value / peak;
}

/** Where on the floor the light is strongest, as a fraction of room depth. */
export function peakDepth(aperture: Aperture): number {
  const curve = floorCurve(aperture, 96);
  let peakIndex = 0;
  curve.forEach((p, i) => {
    if (p.value > curve[peakIndex].value) peakIndex = i;
  });
  return (curve[peakIndex].x - ROOM.left) / (ROOM.right - ROOM.left);
}
