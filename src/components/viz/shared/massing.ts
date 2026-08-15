/**
 * The massing the air study flows around, described once.
 *
 * Coordinates are fractions of the stage, x left to right and y measured
 * UPWARD from the ground line. Both the shader's distance field and the SVG
 * outline read from here, so the drawing and the flow can never disagree about
 * where the building is.
 */

export interface Box {
  /** Centre. */
  cx: number;
  cy: number;
  /** Half-extents. */
  hx: number;
  hy: number;
}

export const GROUND_Y = 0.16;

/** Solid volumes. */
export const massingSolids: Box[] = [
  { cx: 0.46, cy: 0.39, hx: 0.11, hy: 0.23 },
  { cx: 0.64, cy: 0.25, hx: 0.07, hy: 0.09 },
];

/**
 * Openings cut through the solids. They run wider than the block so the cut
 * is clean at both faces.
 */
export const massingOpenings: Box[] = [
  { cx: 0.46, cy: 0.5, hx: 0.14, hy: 0.028 },
  { cx: 0.46, cy: 0.28, hx: 0.14, hy: 0.022 },
];

/** GLSL literal for a box, so the shader and this file share one definition. */
function glslBox(box: Box): string {
  return `sdBox(p, vec2(${box.cx}, ${box.cy}), vec2(${box.hx}, ${box.hy}))`;
}

/**
 * The signed distance function, generated from the same table the outline
 * uses. `uPorosity` shrinks the openings toward closed.
 */
export const MASSING_SDF = /* glsl */ `
float sdBox(vec2 p, vec2 c, vec2 h) {
  vec2 d = abs(p - c) - h;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdBoxScaled(vec2 p, vec2 c, vec2 h, float k) {
  vec2 d = abs(p - c) - vec2(h.x, h.y * k);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdMassing(vec2 p, float porosity) {
  float solid = min(
    ${glslBox(massingSolids[0])},
    ${glslBox(massingSolids[1])}
  );

  // Ground: everything below the line is solid too.
  solid = min(solid, p.y - ${GROUND_Y});

  float k = max(porosity, 0.001);
  float openings = min(
    sdBoxScaled(p, vec2(${massingOpenings[0].cx}, ${massingOpenings[0].cy}),
                vec2(${massingOpenings[0].hx}, ${massingOpenings[0].hy}), k),
    sdBoxScaled(p, vec2(${massingOpenings[1].cx}, ${massingOpenings[1].cy}),
                vec2(${massingOpenings[1].hx}, ${massingOpenings[1].hy}), k)
  );

  return max(solid, -openings);
}
`;
