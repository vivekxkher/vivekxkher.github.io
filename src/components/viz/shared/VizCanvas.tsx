"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDeviceTier, type DeviceTier } from "@/lib/useDeviceTier";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./VizCanvas.module.css";

export interface VizEnv {
  /** False under reduced-motion or while the canvas is off-screen. */
  animate: boolean;
  tier: DeviceTier;
  touch: boolean;
  /** Multiplier for particle counts and loop iterations. */
  budget: number;
}

const VizContext = createContext<VizEnv>({
  animate: true,
  tier: "medium",
  touch: false,
  budget: 0.6,
});

export function useVizEnv() {
  return useContext(VizContext);
}

/**
 * Requests one repaint whenever `signal` changes.
 *
 * Under reduced motion the frame loop is idle, so a visualisation would sit
 * frozen even while its sliders moved. Self-driven animation is what reduced
 * motion asks us to stop — a change the visitor made themselves still has to
 * be drawn.
 */
export function Invalidate({ signal }: { signal: string | number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [signal, invalidate]);
  return null;
}

/**
 * A particle budget that accounts for how much canvas there actually is.
 *
 * Without this, a phone gets the same carrier count as a desktop across a
 * fifth of the area and the field turns into soup. Quantised into quarters so
 * an ordinary resize does not rebuild the vertex buffer.
 */
export function useAreaBudget(base: number, floor = 0.3): number {
  const { budget } = useVizEnv();
  const { size } = useThree();

  const area = (size.width * size.height) / (1440 * 860);
  const bucket = Math.max(floor, Math.min(1, Math.round(area * 4) / 4));
  return Math.max(600, Math.round(base * budget * bucket));
}

const BUDGET: Record<DeviceTier, number> = {
  high: 1,
  medium: 0.55,
  low: 0.25,
};

interface VizCanvasProps {
  children: ReactNode;
  /** Accessible description of what the visualisation shows. */
  label: string;
  /** Canvas responds to pointer drag, so cancel native touch panning. */
  interactive?: boolean;
  className?: string;
  /** Enable the shadow map — only the 3D scenes need it. */
  shadows?: boolean;
  /**
   * Skip filmic tone mapping. The lit 3D scenes want it off: ACES crushes the
   * midtones and a shading study needs to read as measurement, not as film.
   * The shader-based fields write their own colour and are unaffected either
   * way, so they leave this alone.
   */
  flat?: boolean;
  camera?: {
    position: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
}

/**
 * The single entry point for WebGL on this site.
 *
 * Renders nothing until the canvas is near the viewport, freezes the frame
 * loop when it leaves, drops to a single static frame under reduced motion,
 * and scales its own resolution to the device. The canvas is always
 * aria-hidden — the surrounding component supplies the text equivalent.
 */
export function VizCanvas({
  children,
  label,
  interactive = false,
  className,
  shadows = false,
  flat = false,
  camera,
}: VizCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const { tier, dpr, touch, pending } = useDeviceTier();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    // Mount a little before the section arrives; freeze as soon as it leaves.
    const mountObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: "600px 0px" },
    );
    const runObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0 },
    );

    mountObserver.observe(el);
    runObserver.observe(el);

    const onVisibility = () =>
      setVisible(document.visibilityState === "visible" && !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountObserver.disconnect();
      runObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const animate = visible && !reduced;

  return (
    <div
      ref={hostRef}
      className={`${styles.wrap} ${className ?? ""}`}
      data-interactive={interactive}
      aria-hidden="true"
      role="presentation"
      data-viz-label={label}
    >
      {near && !pending ? (
        <VizContext.Provider
          value={{ animate, tier, touch, budget: BUDGET[tier] }}
        >
          <Canvas
            dpr={[1, dpr]}
            shadows={shadows && tier !== "low" ? "percentage" : false}
            flat={flat}
            camera={camera}
            frameloop={animate ? "always" : "demand"}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
              preserveDrawingBuffer: false,
            }}
            style={{ pointerEvents: "none" }}
          >
            {children}
          </Canvas>
        </VizContext.Provider>
      ) : null}
    </div>
  );
}
