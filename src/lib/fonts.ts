import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Archivo — a grotesque with a width axis. Used for architectural display
 * type and all running text. The width axis lets the PÉCLET wordmark sit
 * slightly expanded without a second font file.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/**
 * IBM Plex Mono — the scientific voice: labels, units, indices, readouts.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
