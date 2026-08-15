import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { research, researchBySlug } from "@/content/research";
import { site } from "@/content/site";
import styles from "./page.module.css";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return research.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = researchBySlug.get(slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.standfirst,
    alternates: { canonical: `/research/${note.slug}` },
    openGraph: {
      title: `${note.title} — ${site.name}`,
      description: note.standfirst,
      url: `/research/${note.slug}`,
      type: "article",
    },
  };
}

export default async function ResearchNotePage({ params }: Params) {
  const { slug } = await params;
  const note = researchBySlug.get(slug);
  if (!note) notFound();

  const position = research.findIndex((r) => r.slug === note.slug);
  const next = research[(position + 1) % research.length];

  return (
    <article className={styles.article}>
      <PageIntro
        eyebrow={`PÉCLET / Research / ${note.index}`}
        readout={`${note.minutes} min read`}
        title={note.title}
        lede={note.standfirst}
      >
        <div className={styles.tags}>
          {note.categories.map((category) => (
            <span key={category} className={styles.tag}>
              {category}
            </span>
          ))}
        </div>
      </PageIntro>

      <div className="shell">
        <div className={styles.body}>
          <aside className={styles.rail}>
            <span className={styles.railItem}>
              <span className={styles.railTerm}>Filed under</span>
              <span className={styles.railValue}>
                {note.categories.join(" · ")}
              </span>
            </span>
            <span className={styles.railItem}>
              <span className={styles.railTerm}>Reading time</span>
              <span className={styles.railValue}>
                Approximately {note.minutes} minutes
              </span>
            </span>
            <span className={styles.railItem}>
              <span className={styles.railTerm}>Status</span>
              <span className={styles.railValue}>
                Working note — a position, not a paper
              </span>
            </span>
          </aside>

          <div className={styles.content}>
            {note.blocks.map((block, i) => {
              if (block.type === "statement") {
                return (
                  <blockquote key={i} className={styles.statement} data-reveal>
                    <p className={`display ${styles.statementText}`}>
                      {block.body}
                    </p>
                  </blockquote>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={i} className={styles.list} data-reveal>
                    {block.items?.map((item, k) => (
                      <li key={k} className={styles.listItem}>
                        <span className={styles.listNum}>
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={i} data-reveal>
                  {block.body}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className={styles.pager}>
          <span className="label">Next observation</span>
          <Link href={`/research/${next.slug}`} className={styles.pagerLink}>
            <span className="index">{next.index}</span>
            <span className={`display ${styles.pagerTitle}`}>{next.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
