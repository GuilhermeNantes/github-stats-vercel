const ENT_AMP = String.fromCharCode(38) + "amp;";

function escapeXml(value: string): string {
  return value.replace(/&/g, ENT_AMP);
}

export interface HeatmapAnim {
  enabled: boolean;
  stepMs: number;
  startStep: number;
}

export function renderHeatmap(
  grid: number[][],
  startX: number,
  startY: number,
  cellSize: number,
  cellGap: number,
  maxValue: number,
  accentColor: string,
  mutedColor: string,
  anim: HeatmapAnim = { enabled: false, stepMs: 0, startStep: 0 },
): { svg: string; width: number; height: number; endStep: number } {
  if (grid.length === 0) return { svg: "", width: 0, height: 0, endStep: anim.startStep };

  let svg = "";
  let x = startX;
  let maxRowLen = 0;
  let step = anim.startStep;

  for (const week of grid) {
    let y = startY;
    for (const day of week) {
      const intensity = maxValue > 0 ? Math.min(day / maxValue, 1) : 0;
      const opacity = day === 0 ? 0.06 : 0.15 + intensity * 0.85;

      const animDelay = anim.enabled ? step * anim.stepMs : 0;
      const fadeAnim = anim.enabled
        ? `<animate attributeName="opacity" from="0" to="${opacity}" begin="${animDelay / 1000}s" dur="0.2s" fill="freeze" />`
        : "";

      svg += `
        <rect
          x="${x}"
          y="${y}"
          width="${cellSize}"
          height="${cellSize}"
          rx="2"
          fill="${day === 0 ? mutedColor : accentColor}"
          opacity="${anim.enabled ? "0" : opacity}"
        >
          ${fadeAnim}
        </rect>
      `;
      y += cellSize + cellGap;
      step += 1;
    }
    x += cellSize + cellGap;
    if (week.length > maxRowLen) maxRowLen = week.length;
  }

  const width = grid.length * (cellSize + cellGap);
  const height = maxRowLen * (cellSize + cellGap);

  return { svg, width, height, endStep: step };
}
