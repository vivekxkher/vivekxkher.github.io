"use client";

import { useMemo, useState } from "react";
import {
  atlasBounds,
  atlasCities,
  climateZones,
  projectCity,
  type ZoneId,
} from "@/content/climate";
import styles from "./ClimateAtlas.module.css";

const PLOT = { w: 620, h: 720, pad: 26 };

/**
 * A constellation, not a map.
 *
 * Every point is a real location at its real coordinates, projected
 * equirectangularly. The shape of the country emerges from the data rather
 * than being drawn, which keeps the plot honest about exactly what it knows —
 * fifty-one positions and their climate classification, and nothing else.
 */
export function ClimateAtlas() {
  const [zone, setZone] = useState<ZoneId>("composite");
  const [hovered, setHovered] = useState<string | null>(null);

  const active = climateZones.find((z) => z.id === zone)!;

  const points = useMemo(
    () =>
      atlasCities.map((city) => ({
        city,
        ...projectCity(
          city,
          PLOT.w - PLOT.pad * 2,
          PLOT.h - PLOT.pad * 2,
        ),
      })),
    [],
  );

  const graticule = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let lat = 10; lat <= 35; lat += 5) {
      const a = projectCity(
        { lat, lon: atlasBounds.lonMin },
        PLOT.w - PLOT.pad * 2,
        PLOT.h - PLOT.pad * 2,
      );
      const b = projectCity(
        { lat, lon: atlasBounds.lonMax },
        PLOT.w - PLOT.pad * 2,
        PLOT.h - PLOT.pad * 2,
      );
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    for (let lon = 70; lon <= 95; lon += 5) {
      const a = projectCity(
        { lat: atlasBounds.latMin, lon },
        PLOT.w - PLOT.pad * 2,
        PLOT.h - PLOT.pad * 2,
      );
      const b = projectCity(
        { lat: atlasBounds.latMax, lon },
        PLOT.w - PLOT.pad * 2,
        PLOT.h - PLOT.pad * 2,
      );
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    return lines;
  }, []);

  const zoneCities = atlasCities.filter((c) => c.zone === zone);
  const hoveredPoint = points.find((p) => p.city.name === hovered);

  return (
    <div className={styles.layout}>
      <div className={styles.plotWrap}>
        <div className={styles.plotHead}>
          <span className="label">Fig. 07 — Climate constellation</span>
          <span className="label label--blue" style={{ marginLeft: "auto" }}>
            {atlasCities.length} locations
          </span>
        </div>

        <svg
          className={styles.plot}
          viewBox={`0 0 ${PLOT.w} ${PLOT.h}`}
          role="img"
          aria-label={`A plot of ${atlasCities.length} locations across India at their real coordinates, coloured by climate zone. ${active.name} locations are highlighted: ${zoneCities.map((c) => c.name).join(", ")}.`}
        >
          <g transform={`translate(${PLOT.pad}, ${PLOT.pad})`}>
            {graticule.map((line, i) => (
              <line key={i} className={styles.graticule} {...line} />
            ))}

            {points.map(({ city, x, y }) => {
              const isActive = city.zone === zone;
              const zoneAccent = climateZones.find(
                (z) => z.id === city.zone,
              )!.accent;
              return (
                <circle
                  key={city.name}
                  className={`${styles.city} ${isActive ? "" : styles.cityDim}`}
                  cx={x}
                  cy={y}
                  r={isActive ? 4.4 : 2.8}
                  fill={isActive ? zoneAccent : "#5c646d"}
                  onMouseEnter={() => setHovered(city.name)}
                  onMouseLeave={() =>
                    setHovered((h) => (h === city.name ? null : h))
                  }
                >
                  <title>{`${city.name} — ${climateZones.find((z) => z.id === city.zone)!.name}`}</title>
                </circle>
              );
            })}

            {hoveredPoint ? (
              <g pointerEvents="none">
                <rect
                  className={styles.cityLabelBg}
                  x={hoveredPoint.x + 8}
                  y={hoveredPoint.y - 15}
                  width={hoveredPoint.city.name.length * 6 + 10}
                  height={16}
                />
                <text
                  className={styles.cityLabel}
                  x={hoveredPoint.x + 13}
                  y={hoveredPoint.y - 3}
                >
                  {hoveredPoint.city.name}
                </text>
              </g>
            ) : null}

            <text className={styles.axisLabel} x={0} y={PLOT.h - PLOT.pad * 2}>
              68.5°E
            </text>
            <text
              className={styles.axisLabel}
              x={PLOT.w - PLOT.pad * 2}
              y={PLOT.h - PLOT.pad * 2}
              textAnchor="end"
            >
              95°E
            </text>
          </g>
        </svg>

        <p className={styles.plotFoot}>
          Equirectangular projection · Zones per National Building Code of
          India · Coordinates approximate
        </p>
      </div>

      <div>
        <div className={styles.zones}>
          {climateZones.map((z) => {
            const count = atlasCities.filter((c) => c.zone === z.id).length;
            const expanded = z.id === zone;
            return (
              <button
                key={z.id}
                type="button"
                className={styles.zone}
                aria-expanded={expanded}
                aria-controls="zone-detail"
                onClick={() => setZone(z.id)}
              >
                <span className={styles.zoneIndex}>{z.index}</span>
                <span className={styles.zoneName}>{z.name}</span>
                <span className={styles.zoneCount}>
                  {count} sites
                  <span
                    className={styles.swatch}
                    style={{ background: z.accent }}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.detail} id="zone-detail" aria-live="polite">
          <div className={styles.criterion}>
            <span className="label">Classification</span>
            <span className={styles.criterionValue}>{active.criterion}</span>
          </div>

          <p className={styles.lede}>{active.lede}</p>

          <div className={styles.facts}>
            <span className={styles.fact}>
              <span className={styles.factTerm}>Governed by</span>
              <span className={styles.factValue}>{active.governs}</span>
            </span>
            <span className={styles.fact}>
              <span className={styles.factTerm}>Resource available</span>
              <span className={styles.factValue}>{active.resource}</span>
            </span>
            <span className={styles.fact}>
              <span className={styles.factTerm}>Not available</span>
              <span className={styles.factValue}>{active.absent}</span>
            </span>
          </div>

          <div className={`prose ${styles.prose}`}>
            {active.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.columns}>
            <div>
              <p className={`label ${styles.columnHead}`}>Order of decisions</p>
              <ol className={styles.steps}>
                {active.sequence.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className={`label ${styles.columnHead}`}>Common failures</p>
              <ul className={styles.steps}>
                {active.pitfalls.map((pitfall, i) => (
                  <li key={i} className={styles.pitfall}>
                    <span className={styles.pitfallMark} aria-hidden="true">
                      ×
                    </span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p
              className={`label ${styles.columnHead}`}
              style={{ marginTop: "var(--space-xl)" }}
            >
              {active.name} locations
            </p>
            <div className={styles.cityList}>
              {zoneCities.map((city) => (
                <span
                  key={city.name}
                  className={styles.cityName}
                  onMouseEnter={() => setHovered(city.name)}
                  onMouseLeave={() =>
                    setHovered((h) => (h === city.name ? null : h))
                  }
                >
                  {city.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
