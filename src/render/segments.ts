import { escapeXml } from "./text";

export interface SegmentItem {
  label: string;
  value: number;
  color: string;
}

const SEGMENT_X = 28;
const SEGMENT_HEIGHT = 16;
const TRACK_COLOR = "#444444";

export function renderSegments(
  items: SegmentItem[],
  startY: number,
): { svg: string; height: number } {
  if (items.length === 0) return { svg: "", height: 0 };

  const total = items.reduce((sum, item) => sum + item.value, 0);
  const totalWidth = 680;
  const trackWidth = totalWidth - SEGMENT_X * 2;

  let x = SEGMENT_X;
  let svg = "";

  for (const item of items) {
    const ratio = total > 0 ? item.value / total : 0;
    const width = trackWidth * ratio;
    svg += `
      <rect
        x="${x}"
        y="${startY}"
        width="${width}"
        height="${SEGMENT_HEIGHT}"
        fill="${item.color}"
      />
    `;
    x += width;
  }

  svg += `
    <text
      x="${SEGMENT_X}"
      y="${startY + SEGMENT_HEIGHT + 18}"
      fill="${TRACK_COLOR}"
      font-family="Courier New, monospace"
      font-size="12"
    >
      ${buildLegend(items, total)}
    </text>
  `;

  return { svg, height: SEGMENT_HEIGHT + 30 };
}

function buildLegend(items: SegmentItem[], total: number): string {
  return items
    .map((item) => {
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
      return `[${item.color}] ${escapeXml(item.label)} ${pct}%`;
    })
    .join("   ");
}
