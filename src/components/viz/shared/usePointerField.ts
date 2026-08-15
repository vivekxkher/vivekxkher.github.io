"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface PointerField {
  /** Raw normalised position within the element, 0…1, y measured from top. */
  x: number;
  y: number;
  /** Smoothed position — what shaders should read. */
  sx: number;
  sy: number;
  /** 0 when idle, 1 when the pointer is engaged. Eases between the two. */
  engagement: number;
  /** True once the visitor has interacted at all. */
  everMoved: boolean;
  /** Pointer is currently held down / touched. */
  down: boolean;
}

const INITIAL: PointerField = {
  x: 0.5,
  y: 0.5,
  sx: 0.5,
  sy: 0.5,
  engagement: 0,
  everMoved: false,
  down: false,
};

/**
 * Pointer and touch tracking normalised to an element, updated without
 * re-rendering React. Frame loops read `.current` directly.
 *
 * `onFirstMove` fires once, so the page can react the first time the visitor
 * touches the field.
 */
export function usePointerField(
  ref: RefObject<HTMLElement | null>,
  onFirstMove?: () => void,
): RefObject<PointerField> {
  const field = useRef<PointerField>({ ...INITIAL });
  const callback = useRef(onFirstMove);
  callback.current = onFirstMove;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();
    const remeasure = () => {
      rect = el.getBoundingClientRect();
    };

    const set = (clientX: number, clientY: number) => {
      const f = field.current;
      f.x = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      f.y = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
      f.engagement = 1;
      if (!f.everMoved) {
        f.everMoved = true;
        callback.current?.();
      }
    };

    const onMove = (e: PointerEvent) => set(e.clientX, e.clientY);
    const onDown = (e: PointerEvent) => {
      field.current.down = true;
      set(e.clientX, e.clientY);
    };
    const onUp = () => {
      field.current.down = false;
    };
    const onLeave = () => {
      field.current.engagement = 0;
      field.current.down = false;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });

    const observer = new ResizeObserver(remeasure);
    observer.observe(el);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      observer.disconnect();
    };
  }, [ref]);

  return field;
}

/** Critically-damped-ish smoothing used by every frame loop on the site. */
export function smoothPointer(f: PointerField, dt: number, rate = 6) {
  const k = 1 - Math.exp(-rate * dt);
  f.sx += (f.x - f.sx) * k;
  f.sy += (f.y - f.sy) * k;
}
