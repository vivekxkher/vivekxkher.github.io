"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, secondaryNav, site } from "@/content/site";
import { getLenis } from "@/lib/scroll";
import styles from "./SiteHeader.module.css";

const menuItems = [...primaryNav, ...secondaryNav];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scrolling, trap focus and honour Escape while the menu is open.
  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const focusables = overlay
      ? Array.from(
          overlay.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"),
        )
      : [];
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  return (
    <>
      <header
        className={styles.header}
        data-site-chrome="header"
        data-scrolled={scrolled}
        data-open={open}
      >
        <div className={styles.bar}>
          {/* No aria-label: the accessible name is the visible text, which is
              what keeps voice control and the label/name check happy. */}
          <Link href="/" className={styles.brand}>
            <span className={styles.mark}>{site.name}</span>
            <span className={styles.markSub}>{site.discipline}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className={styles.toggleGlyph} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        ref={overlayRef}
        className={styles.overlay}
        data-open={open}
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
        inert={!open}
      >
        <nav className={styles.overlayNav} aria-label="Menu">
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.overlayLink}
              data-active={isActive(item.href)}
            >
              <span className={styles.overlayIndex} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.overlayLabel}>{item.label}</span>
              <span className={styles.overlayNote} aria-hidden="true">
                {item.note}
              </span>
            </Link>
          ))}
        </nav>

        <div className={styles.overlayFoot}>
          <span className="label">{site.tagline}</span>
          <a className="label label--blue" href={site.contact.emailHref}>
            {site.contact.email}
          </a>
        </div>
      </div>
    </>
  );
}
