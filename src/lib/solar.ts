/**
 * Solar geometry.
 *
 * Standard astronomical formulae for apparent solar position — declination
 * from day of year, hour angle from solar time, then altitude and azimuth for
 * a given latitude. Accurate enough for shading studies at design stage; this
 * is geometry, not a weather file, and it makes no claim about cloud cover or
 * actual irradiance on any real day.
 */

const DEG = Math.PI / 180;

export interface SunPosition {
  /** Degrees above the horizon. Negative when the sun is down. */
  altitude: number;
  /** Degrees, measured from south, positive toward west. */
  azimuth: number;
  /** Unit vector in scene space: +x west, +y up, +z south. */
  direction: [number, number, number];
  up: boolean;
}

/** Days from 1 January to the middle of each month. */
const MONTH_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Solar declination in degrees for a day of year. */
export function declination(dayOfYear: number): number {
  return 23.45 * Math.sin(((360 * (284 + dayOfYear)) / 365) * DEG);
}

export function dayForMonth(monthIndex: number): number {
  return MONTH_DAY[Math.min(Math.max(monthIndex, 0), 11)];
}

/**
 * @param latitude degrees north
 * @param monthIndex 0–11
 * @param hour solar time, 0–24
 */
export function sunPosition(
  latitude: number,
  monthIndex: number,
  hour: number,
): SunPosition {
  const phi = latitude * DEG;
  const delta = declination(dayForMonth(monthIndex)) * DEG;
  const H = (hour - 12) * 15 * DEG;

  const sinAlt =
    Math.sin(phi) * Math.sin(delta) +
    Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  const altitude = Math.asin(Math.min(Math.max(sinAlt, -1), 1));

  // Azimuth measured from south, positive to the west.
  const azimuth = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(delta) * Math.cos(phi),
  );

  const cosAlt = Math.cos(altitude);
  return {
    altitude: altitude / DEG,
    azimuth: azimuth / DEG,
    direction: [cosAlt * Math.sin(azimuth), Math.sin(altitude), cosAlt * Math.cos(azimuth)],
    up: altitude > 0,
  };
}

/** Sunrise and sunset in solar time, or null if the sun never sets/rises. */
export function daylightHours(
  latitude: number,
  monthIndex: number,
): { sunrise: number; sunset: number; length: number } | null {
  const phi = latitude * DEG;
  const delta = declination(dayForMonth(monthIndex)) * DEG;
  const cosH = -Math.tan(phi) * Math.tan(delta);
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / DEG / 15;
  return { sunrise: 12 - H, sunset: 12 + H, length: 2 * H };
}

/** The sun's track across one day, sampled for drawing. */
export function sunPath(
  latitude: number,
  monthIndex: number,
  samples = 96,
): SunPosition[] {
  const out: SunPosition[] = [];
  for (let i = 0; i <= samples; i++) {
    out.push(sunPosition(latitude, monthIndex, (i / samples) * 24));
  }
  return out;
}

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
