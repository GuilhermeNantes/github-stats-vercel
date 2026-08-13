import { escapeXml } from "./text";

export interface BarItem {
  label: string;
  value: number;
  max: number;
  color: string;
}

const BAR_X = 28;
const LABEL_WIDTH = 110;
const VALUE_WIDTH = 50;
const BAR_GAP = 6;
const ROW_HEIGHT = 22;
const FONT_SIZE = 12;

export function renderBars(
  items: BarItem[],
  startY: number,
  trackColor: string,
): string {
  if (items.length === 0) return "";

  const totalWidth = 680;
  const barAreaX = BAR_X + LABEL_WIDTH;
  const barAreaWidth = totalWidth - barAreaX - VALUE_WIDTH - BAR_X;

  let svg = "";
  let y = startY;

  for (const item of items) {
    const ratio = item.max > 0 ? Math.min(item.value / item.max, 1) : 0;
    const barWidth = Math.max(barAreaWidth * ratio, ratio > 0 ? 2 : 0);

    svg += `
      <text
        x="${BAR_X}"
        y="${y}"
        fill="${trackColor}"
        font-family="Courier New, monospace"
        font-size="${FONT_SIZE}"
      >
        ${escapeXml(item.label)}
      </text>

      <rect
        x="${barAreaX}"
        y="${y - 10}"
        width="${barAreaWidth}"
        height="10"
        rx="2"
        fill="${trackColor}"
        opacity="0.18"
      />

      <rect
        x="${barAreaX}"
        y="${y - 10}"
        width="${barWidth}"
        height="10"
        rx="2"
        fill="${item.color}"
      />

      <text
        x="${totalWidth - BAR_X}"
        y="${y}"
        fill="${trackColor}"
        font-family="Courier New, monospace"
        font-size="${FONT_SIZE}"
        text-anchor="end"
      >
        ${formatValue(item.value)}
      </text>
    `;

    y += ROW_HEIGHT + BAR_GAP;
  }

  return svg;
}

export function barsHeight(items: BarItem[]): number {
  if (items.length === 0) return 0;
  return items.length * (ROW_HEIGHT + BAR_GAP);
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}
