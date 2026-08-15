import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ProjectFigure } from "@/components/viz/ProjectFigure";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Project Atlas",
  description:
    "PÉCLET / PROJECT ATLAS — conceptual studies in building physics and climate design. Every entry is clearly marked as a study rather than commissioned work.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Project Atlas — PÉCLET",
    description:
      "Conceptual studies in building physics and climate design, each marked as a study rather than commissioned work.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / Project Atlas"
        readout={`${String(projects.length).padStart(2, "0")} Studies`}
        title={
          <>
            Studies in
            <br />
            physics.
          </>
        }
        lede="An atlas of problems rather than a portfolio of buildings. Each entry takes one climate, one typology and one governing phenomenon, and works the section until the physics makes sense."
      >
        <div className={styles.notice}>
          <span className="label label--blue">Please note</span>
          <p className={styles.noticeText}>
            Every entry below is a self-directed study. None describes a
            client, a site, a built project or a measured result, and no
            performance figures, savings or certifications are claimed
            anywhere in this atlas.
          </p>
        </div>
      </PageIntro>

      <section className="shell section--tight" aria-label="Projects">
        <div className={styles.list}>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={styles.item}
              data-reveal
            >
              <div className={styles.body}>
                <div className={styles.meta}>
                  <span className="index">{project.index}</span>
                  <span className={styles.status}>{project.status}</span>
                  <span className="label">{project.climate}</span>
                </div>

                <h2 className={`display ${styles.title}`}>{project.title}</h2>
                <p className={styles.subtitle}>{project.subtitle}</p>

                <div className={styles.specs}>
                  <span className={styles.spec}>
                    <span className={styles.specTerm}>Typology</span>
                    <span className={styles.specValue}>{project.typology}</span>
                  </span>
                  <span className={styles.spec}>
                    <span className={styles.specTerm}>Climate zone</span>
                    <span className={styles.specValue}>{project.climate}</span>
                  </span>
                  <span className={styles.spec}>
                    <span className={styles.specTerm}>Stage</span>
                    <span className={styles.specValue}>{project.stage}</span>
                  </span>
                </div>

                <span className={styles.more}>
                  Read the case study
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>

              <div className={styles.figure}>
                <ProjectFigure slug={project.slug} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
