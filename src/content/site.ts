/**
 * Global site facts. Everything the shell needs to render — nothing else
 * hard-codes a name, a URL or a nav label.
 */

export const site = {
  name: "PÉCLET",
  /** Used where diacritics are unsafe (aria labels read fine either way). */
  nameAscii: "PECLET",
  discipline: "Building Physics",
  practice: "Climate Design",
  tagline: "Building Physics | Climate Design",
  /** IDN. `new URL()` normalises this to its punycode form for canonicals. */
  url: "https://péclet.com",
  description:
    "PÉCLET is a building physics and climate design practice. We study how buildings exchange heat, light, air and moisture with their climate, and translate those interactions into design decisions.",
  locale: "en",
  /**
   * PLACEHOLDER — replace with real practice details before launch.
   * Nothing here is presented on the site as a verified credential.
   */
  contact: {
    email: "hello@peclet.co",
    emailHref: "mailto:hello@peclet.co",
    location: "Péclet Haus, Sindhubhavan Road, PRL Colony, Thaltej, Ahmedabad, Gujarat 380059",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Shown in the overlay menu as a one-line description. */
  note: string;
}

export const primaryNav: NavItem[] = [
  { label: "Work", href: "/work", note: "Project Atlas — studies in physics" },
  {
    label: "Disciplines",
    href: "/disciplines",
    note: "Six transport phenomena",
  },
  { label: "Research", href: "/research", note: "Observations and method" },
  { label: "About", href: "/about", note: "The practice" },
  { label: "Contact", href: "/contact", note: "Start a conversation" },
];

export const secondaryNav: NavItem[] = [
  {
    label: "India Climate Atlas",
    href: "/atlas",
    note: "Building performance across five climate zones",
  },
];
