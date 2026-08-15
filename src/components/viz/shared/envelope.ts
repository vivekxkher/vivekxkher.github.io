/**
 * A single description of the envelope section used by the hero and by the
 * thermal discipline page. The DOM linework and the GPU particle field both
 * read these numbers, so the drawing and the physics can never drift apart.
 *
 * `x0`/`x1` are fractions of the viewport width.
 * `residence` is the share of a particle's total crossing time spent in the
 * layer — it stands in for thermal resistance, so the temperature drop across
 * each layer is proportional to it. That is why the gradient steepens through
 * the insulation.
 *
 * The build-up is an INDICATIVE generic assembly, not a project specification.
 */

export interface EnvelopeLayer {
  id: string;
  name: string;
  /** Indicative nominal thickness, for the section annotation only. */
  gauge: string;
  x0: number;
  x1: number;
  residence: number;
  /** 0 = air, 1 = solid. Drives diffusion amplitude and particle opacity. */
  solidity: number;
  hatch: "none" | "solid" | "batt" | "aggregate" | "sheet";
}

export const envelopeLayers: EnvelopeLayer[] = [
  {
    id: "exterior",
    name: "Exterior air",
    gauge: "—",
    x0: 0.0,
    x1: 0.32,
    residence: 0.1,
    solidity: 0,
    hatch: "none",
  },
  {
    id: "cladding",
    name: "Rainscreen",
    gauge: "12",
    x0: 0.32,
    x1: 0.352,
    residence: 0.06,
    solidity: 1,
    hatch: "sheet",
  },
  {
    id: "cavity",
    name: "Ventilated cavity",
    gauge: "40",
    x0: 0.352,
    x1: 0.394,
    residence: 0.035,
    solidity: 0,
    hatch: "none",
  },
  {
    id: "insulation",
    name: "Insulation",
    gauge: "150",
    x0: 0.394,
    x1: 0.546,
    residence: 0.4,
    solidity: 0.75,
    hatch: "batt",
  },
  {
    id: "structure",
    name: "Structure",
    gauge: "200",
    x0: 0.546,
    x1: 0.626,
    residence: 0.19,
    solidity: 1,
    hatch: "aggregate",
  },
  {
    id: "finish",
    name: "Internal finish",
    gauge: "12",
    x0: 0.626,
    x1: 0.648,
    residence: 0.06,
    solidity: 1,
    hatch: "solid",
  },
  {
    id: "interior",
    name: "Interior air",
    gauge: "—",
    x0: 0.648,
    x1: 1.0,
    residence: 0.175,
    solidity: 0,
    hatch: "none",
  },
];

/** Layers that form the constructed assembly (everything but the two air zones). */
export const assemblyLayers = envelopeLayers.filter(
  (l) => l.id !== "exterior" && l.id !== "interior",
);

export const LAYER_COUNT = envelopeLayers.length;

/** x boundaries: LAYER_COUNT + 1 values. */
export const layerBounds: number[] = [
  ...envelopeLayers.map((l) => l.x0),
  envelopeLayers[envelopeLayers.length - 1].x1,
];

/** Cumulative residence fractions, normalised to end at exactly 1. */
export const layerPhases: number[] = (() => {
  const total = envelopeLayers.reduce((sum, l) => sum + l.residence, 0);
  const out = [0];
  let acc = 0;
  for (const layer of envelopeLayers) {
    acc += layer.residence / total;
    out.push(acc);
  }
  out[out.length - 1] = 1;
  return out;
})();

/** Solidity per layer, indexed to match `envelopeLayers`. */
export const layerSolidity: number[] = envelopeLayers.map((l) => l.solidity);

/** Fraction of viewport width occupied by the constructed assembly. */
export const assemblySpan = {
  x0: assemblyLayers[0].x0,
  x1: assemblyLayers[assemblyLayers.length - 1].x1,
};

/**
 * Per-carrier brightness compensation.
 *
 * Carriers are seeded uniformly in phase, which is the honest steady state
 * for a conserved flux: they crowd wherever transport slows. Left alone the
 * insulation would blow out under additive blending while the air zones went
 * bare. Scaling each carrier's brightness by a partial power of the local
 * spacing evens the exposure out while leaving the crowding visible — the
 * insulation still glows, it just no longer clips.
 */
export const layerExposure: number[] = (() => {
  const spacing = envelopeLayers.map((layer, i) => {
    const dx = layer.x1 - layer.x0;
    const du = layerPhases[i + 1] - layerPhases[i];
    return dx / Math.max(du, 1e-6);
  });
  const max = Math.max(...spacing);
  return spacing.map((s) => Math.pow(s / max, 0.42));
})();
