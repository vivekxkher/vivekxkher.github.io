import type { Metadata } from "next";

/**
 * Metadata lives in a layout because the card itself has to be a client
 * component: it reads its text from the query string, and a statically
 * exported site has no server to read query strings on.
 */
export const metadata: Metadata = {
  title: "Social card preview",
  robots: { index: false, follow: false },
};

export default function OgPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
