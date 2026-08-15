import { Hero } from "@/components/home/Hero";
import { PecletSection } from "@/components/home/PecletSection";
import { DisciplineIndex } from "@/components/home/DisciplineIndex";
import {
  AtlasTeaser,
  ResearchPreview,
  WorkPreview,
} from "@/components/home/HomeIndex";

export default function Home() {
  return (
    <>
      <Hero />
      <PecletSection />
      <DisciplineIndex />
      <WorkPreview />
      <AtlasTeaser />
      <ResearchPreview />
    </>
  );
}
