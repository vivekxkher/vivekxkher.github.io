import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { research } from "@/content/research";
import { ResearchIndex } from "./ResearchIndex";

export const metadata: Metadata = {
  title: "Research",
  description:
    "PÉCLET / RESEARCH — observations on building physics, climate, materials, passive house, energy, simulation and building in Indian climates.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research — PÉCLET",
    description:
      "Observations on building physics, climate, materials, energy, simulation and building in Indian climates.",
    url: "/research",
  },
};

export default function ResearchPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / Research"
        readout={`${String(research.length).padStart(2, "0")} Observations`}
        title={
          <>
            Research
            <br />
            &amp; observations.
          </>
        }
        lede="Positions we keep returning to, written down so they can be argued with. These are working notes rather than published papers — they cite standards where standards exist and say plainly where they do not."
      >
        <ResearchIndex />
      </PageIntro>
    </>
  );
}
