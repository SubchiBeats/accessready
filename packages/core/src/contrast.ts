export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseColor(value: string | undefined): Rgb | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().toLowerCase();
  const named: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    blue: "#0000ff",
    gray: "#808080",
    grey: "#808080",
    yellow: "#ffff00",
    green: "#008000"
  };
  const normalized = named[trimmed] ?? trimmed;
  const hex = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((ch) => ch + ch).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  }
  const rgb = normalized.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
  }
  return undefined;
}

export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(rgb: Rgb): number {
  const convert = (channel: number) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * convert(rgb.r) + 0.7152 * convert(rgb.g) + 0.0722 * convert(rgb.b);
}

export function extractStyleColor(style: string | undefined, property: "color" | "background-color"): string | undefined {
  if (!style) return undefined;
  // Guard the leading boundary so "color" does not match inside "background-color".
  const re = new RegExp(`(?:^|[;\\s])${property}\\s*:\\s*([^;]+)`, "i");
  return style.match(re)?.[1]?.trim();
}
