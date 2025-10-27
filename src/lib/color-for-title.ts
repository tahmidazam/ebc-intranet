const PALETTE: string[] = [
  "#264653", // dark teal
  "#2A9D8F", // muted green-teal
  "#E9C46A", // warm sand
  "#F4A261", // muted orange
  "#E76F51", // terracotta
  "#8AB17D", // soft green
  "#6A4C93", // muted purple
  "#4B8BBE", // steel blue
  "#D67F9B", // muted rose
  "#B56576", // dusty maroon
  "#6B705C", // olive gray
  "#7D7F9A", // slate
];

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
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#FFFFFF";
}

function simpleHash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getColorFromString(str: string) {
  const textKey = (str || "").toString();
  const idx = simpleHash(textKey) % PALETTE.length;
  const background = PALETTE[idx];
  const text = getContrastTextColor(background);
  return { background, text };
}
