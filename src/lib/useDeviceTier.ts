"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "medium" | "low";

export interface DeviceProfile {
  tier: DeviceTier;
  /** Device pixel ratio clamped to something a GPU can actually sustain. */
  dpr: number;
  /** Coarse pointer — drive interactions from touch and scroll instead. */
  touch: boolean;
  /** True until the first client measurement lands. */
  pending: boolean;
}

const DEFAULT: DeviceProfile = {
  tier: "medium",
  dpr: 1.5,
  touch: false,
  pending: true,
};

function measure(): DeviceProfile {
  const cores = navigator.hardwareConcurrency ?? 4;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const narrow = window.innerWidth < 760;

  // Data-saver or very constrained hardware drops straight to the low tier.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData || cores <= 2 || memory <= 2) {
    return { tier: "low", dpr: 1, touch, pending: false };
  }

  if (touch || narrow || cores <= 4) {
    return {
      tier: "medium",
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      touch,
      pending: false,
    };
  }

  return {
    tier: "high",
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    touch,
    pending: false,
  };
}

/**
 * A cheap, honest read of what this device can sustain. Visualisations scale
 * particle counts and resolution from it rather than guessing.
 */
export function useDeviceTier(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(DEFAULT);

  useEffect(() => {
    setProfile(measure());

    const mql = window.matchMedia("(pointer: coarse)");
    const onChange = () => setProfile(measure());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return profile;
}
