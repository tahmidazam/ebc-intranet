// Deterministic color generation from a string (event title/summary)
// Produces an HSL-based color so colours are consistent across events with same title.
export function hashStringToHue(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // basic djb2-like mix
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // convert to 32bit int
  }
  return Math.abs(hash) % 360;
}

function hslToHex(h: number, s: number, l: number) {
  // convert HSL to RGB then to hex
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  return (
    "#" +
    ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1).toUpperCase()
  );
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace(/^#/, "");
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getContrastTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  // relative luminance formula
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#FFFFFF";
}

export function getColorFromString(str: string) {
  const hue = hashStringToHue(str || "");
  // Slightly darker and duller than before: reduce saturation and lightness a bit.
  const hex = hslToHex(hue, 52, 40);
  const text = getContrastTextColor(hex);
  return { background: hex, text };
}
