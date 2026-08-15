import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisciplineInstrument } from "@/components/instruments";
import { PageIntro } from "@/components/ui/PageIntro";
import { disciplines, disciplineBySlug } from "@/content/disciplines";
import { site } from "@/content/site";
import styles from "./page.module.css";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const discipline = disciplineBySlug.get(slug as never);
  if (!discipline) return {};

  return {
    title: discipline.title,
    description: `${discipline.title} — ${discipline.lede}`,
    alternates: { canonical: `/disciplines/${discipline.slug}` },
    openGraph: {
      title: `${discipline.title} — ${site.name}`,
      description: discipline.lede,
      url: `/disciplines/${discipline.slug}`,
      type: "article",
    },
  };
}

export default async function DisciplinePage({ params }: Params) {
  const { slug } = await params;
  const discipline = disciplineBySlug.get(slug as never);
  if (!discipline) notFound();

  const position = disciplines.findIndex((d) => d.slug === discipline.slug);
  const previous =
    disciplines[(position - 1 + disciplines.length) % disciplines.length];
  const next = disciplines[(position + 1) % disciplines.length];

  return (
    <>
      <PageIntro
        eyebrow={`PÉCLET / Disciplines / ${discipline.index}`}
        readout={discipline.unit}
        title={discipline.title}
        lede={discipline.lede}
      >
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaTerm}>Quantity</span>
            <span className={styles.metaValue}>{discipline.quantity}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaTerm}>Transport</span>
            <span className={styles.metaValue}>{discipline.transport}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaTerm}>Interaction</span>
            <span className={styles.metaValue}>{discipline.interaction}</span>
          </span>
        </div>
      </PageIntro>

      <div className="shell">
        <div className={styles.instrumentWrap}>
          <DisciplineInstrument discipline={discipline} />
        </div>
      </div>

      <div className="shell">
        <div className={styles.body}>
          <div>
            <p className={`label ${styles.columnHead}`}>The position</p>
            <div className="prose">
              {discipline.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={styles.split}>
            <div>
              <p className={`label ${styles.columnHead}`}>What we ask</p>
              <ul className={styles.list}>
                {discipline.questions.map((question, i) => (
                  <li key={i} className={styles.listItem}>
                    <span className={styles.listNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={`label ${styles.columnHead}`}>How we answer it</p>
              <ul className={styles.list}>
                {discipline.methods.map((method, i) => (
                  <li key={i} className={styles.listItem}>
                    <span className={styles.listNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        <nav className={styles.pager} aria-label="Disciplines">
          <Link
            href={`/disciplines/${previous.slug}`}
            className={styles.pagerLink}
          >
            <span className="label">&larr; Previous</span>
            <span className={`display ${styles.pagerTitle}`}>
              {previous.title}
            </span>
          </Link>
          <Link
            href={`/disciplines/${next.slug}`}
            className={`${styles.pagerLink} ${styles.pagerLinkEnd}`}
          >
            <span className="label">Next &rarr;</span>
            <span className={`display ${styles.pagerTitle}`}>{next.title}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
