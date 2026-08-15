import type { Metadata } from "next";
import { ClimateAtlas } from "@/components/atlas/ClimateAtlas";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "India Climate Atlas",
  description:
    "Building performance across India's five climate zones — hot & dry, warm & humid, composite, moderate and cold. What governs each, what resource each offers, and the order design decisions should be taken in.",
  alternates: { canonical: "/atlas" },
  openGraph: {
    title: "India Climate Atlas — PÉCLET",
    description:
      "Building performance across India's five climate zones, and the order design decisions should be taken in.",
    url: "/atlas",
  },
};

export default function AtlasPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / India Climate Atlas"
        readout="05 Zones"
        title={
          <>
            Building
            <br />
            performance in
            <br />
            Indian climates.
          </>
        }
        lede="A detail that is correct in one Indian climate zone can be a defect in another. This atlas sets out what governs each zone, what resource each one offers, and the order in which decisions should be taken."
      />

      <section className="shell section--tight" aria-label="Climate zones">
        <ClimateAtlas />
      </section>
    </>
  );
}
