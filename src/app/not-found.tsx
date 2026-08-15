import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { primaryNav } from "@/content/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageIntro
      eyebrow="PÉCLET / 404"
      readout="No such page"
      title={
        <>
          Nothing here
          <br />
          to measure.
        </>
      }
      lede="That address does not resolve to anything. It may have moved, or it may never have existed."
    >
      <nav
        aria-label="Elsewhere on the site"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem 2rem",
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href} className="label label--bright">
            {item.label}
          </Link>
        ))}
      </nav>
    </PageIntro>
  );
}
