"use client";

import { useState } from "react";
import { Instrument, ToggleGroup } from "@/components/viz/Instrument";
import {
  EnergyBalance,
  computeBalance,
  energyMeasures,
} from "@/components/viz/EnergyBalance";
import type { Discipline } from "@/content/disciplines";

export function EnergyInstrument({ discipline }: { discipline: Discipline }) {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (id: string) =>
    setActive((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    );

  const { terms, total } = computeBalance(active);
  const dominant = [...terms].sort((a, b) => b.value - a.value)[0];

  const caption = `${discipline.altText} The figures are an illustrative index in which the untreated baseline is defined as 100. They compare the relative effect of measures on one another and are not a calculation, prediction or claim about any building.`;

  return (
    <Instrument
      figure="Fig. 06 — Cooling-season balance"
      hint="Switch measures on and off"
      caption={caption}
      controls={
        <ToggleGroup
          label="Measures applied"
          options={energyMeasures}
          active={active}
          onToggle={toggle}
        />
      }
    >
      <EnergyBalance active={active} />
      <span className="sr-only">
        With {active.length === 0 ? "no measures" : `${active.length} measures`}{" "}
        applied, the residual demand index stands at {total.toFixed(0)} against
        a baseline of 100. The largest remaining term is {dominant.label} at{" "}
        {dominant.value.toFixed(0)}. Terms:{" "}
        {terms
          .map((t) => `${t.label} ${t.value.toFixed(0)}`)
          .join(", ")}
        .
      </span>
    </Instrument>
  );
}
