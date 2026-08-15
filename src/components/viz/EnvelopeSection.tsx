"use client";

import { assemblyLayers, assemblySpan, envelopeLayers } from "./shared/envelope";
import styles from "./EnvelopeSection.module.css";

const pc = (v: number) => `${(v * 100).toFixed(3)}%`;

interface EnvelopeSectionProps {
  active: boolean;
  /** Exterior temperature readout, °C. */
  exteriorTemp: number;
  /** Interior temperature readout, °C. */
  interiorTemp: number;
}

/**
 * The architectural linework, drawn in the DOM so the strokes stay one
 * device pixel wide at any zoom or resolution. Geometry comes from the same
 * layer table the particle shader reads, so drawing and simulation agree.
 *
 * Decorative: the hero supplies the text equivalent.
 */
export function EnvelopeSection({
  active,
  exteriorTemp,
  interiorTemp,
}: EnvelopeSectionProps) {
  return (
    <div className={styles.section} data-active={active} aria-hidden="true">
      {/* Continuation of the assembly beyond the cut */}
      {envelopeLayers.slice(1, -1).map((layer) => (
        <span
          key={`cut-${layer.id}`}
          className={styles.cut}
          style={{ left: pc(layer.x0) }}
        />
      ))}
      <span className={styles.cut} style={{ left: pc(assemblySpan.x1) }} />

      {assemblyLayers.map((layer, i) => (
        <span
          key={layer.id}
          className={`${styles.band} ${styles[`hatch-${layer.hatch}`] ?? ""}`}
          style={
            {
              left: pc(layer.x0),
              width: pc(layer.x1 - layer.x0),
              "--band-delay": `${i * 90}ms`,
            } as React.CSSProperties
          }
        />
      ))}

      {assemblyLayers.map((layer, i) => (
        <span
          key={`label-${layer.id}`}
          className={styles.layerLabel}
          style={
            {
              left: pc((layer.x0 + layer.x1) / 2),
              // Stagger the rotated labels so narrow layers stay legible.
              top: i % 2 === 0 ? "15%" : "24%",
              "--band-delay": `${350 + i * 90}ms`,
            } as React.CSSProperties
          }
        >
          {layer.name}
          {layer.gauge !== "—" ? (
            <span className={styles.layerGauge}>{layer.gauge}</span>
          ) : null}
        </span>
      ))}

      {/* Advection — ordered transport, outside the assembly */}
      <div className={`${styles.motif} ${styles.motifAdvection}`}>
        <span className={styles.motifGlyph}>&rarr;&rarr;&rarr;&rarr;</span>
        <span className={styles.motifName}>Advection</span>
      </div>

      {/* Diffusion — random transport, inside the insulation */}
      <div
        className={`${styles.motif} ${styles.motifDiffusion}`}
        style={{
          left: pc(
            (assemblyLayers[2].x0 + assemblyLayers[2].x1) / 2,
          ),
        }}
      >
        <span className={styles.motifGlyph}>&middot;&nbsp;&middot;&nbsp;&middot;</span>
        <span className={styles.motifName}>Diffusion</span>
      </div>

      <div className={`${styles.zone} ${styles.zoneExterior}`}>
        <span className={styles.zoneName}>Exterior</span>
        <span className={styles.zoneValue}>
          {exteriorTemp.toFixed(1)}&thinsp;&deg;C
        </span>
        <span className={styles.zoneNote}>Driving condition</span>
      </div>

      <div className={`${styles.zone} ${styles.zoneInterior}`}>
        <span className={styles.zoneName}>Interior</span>
        <span className={styles.zoneValue}>
          {interiorTemp.toFixed(1)}&thinsp;&deg;C
        </span>
        <span className={styles.zoneNote}>Design condition</span>
      </div>

      <span
        className={styles.dimension}
        style={{
          left: pc(assemblySpan.x0),
          width: pc(assemblySpan.x1 - assemblySpan.x0),
        }}
      >
        <span className={styles.dimensionText}>
          Indicative assembly &middot; not a specification
        </span>
      </span>
    </div>
  );
}
