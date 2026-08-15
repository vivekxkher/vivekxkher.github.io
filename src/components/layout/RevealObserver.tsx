"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * A single IntersectionObserver for every [data-reveal] element on the page.
 * Elements are visible by default in CSS; the `.js` class on <html> is what
 * hides them, so this degrades cleanly if the bundle never arrives.
 *
 * The revealed state is an ATTRIBUTE, not a class. Several revealed elements
 * are React components that also toggle a class on hover — and React rewrites
 * `className` wholesale on re-render, which would wipe a class added here and
 * snap the element back to invisible. React leaves attributes it never set
 * alone, so this survives.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduced) {
      nodes.forEach((n) => n.setAttribute("data-revealed", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.setAttribute("data-revealed", "");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    nodes.forEach((n) => {
      if (!n.hasAttribute("data-revealed")) observer.observe(n);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
