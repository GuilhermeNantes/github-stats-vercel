const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface LangPill {
  label: string;
  value: number;
  color: string;
}

const START_X = 28;
const TOTAL_WIDTH = 680 - START_X * 2;
const ROW_HEIGHT = 36;
const ROW_GAP = 8;

const BAR_FILL = "#B11226";
const BAR_TRACK = "#222222";

export function renderLangPills(
  items: LangPill[],
  startY: number,
  mutedColor: string,
  foregroundColor: string,
  anim: { enabled: boolean; stepMs: number; startStep: number },
): { svg: string; height: number; endStep: number } {
  if (items.length === 0) return { svg: "", height: 0, endStep: anim.startStep };

  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return { svg: "", height: 0, endStep: anim.startStep };

  const max = Math.max(...items.map((i) => i.value));
  let svg = "";
  let y = startY;
  let step = anim.startStep;

  for (const item of items) {
    const pct = (item.value / total) * 100;
    const ratio = max > 0 ? item.value / max : 0;
    const barWidth = (TOTAL_WIDTH - 110) * ratio;

    const animDelay = anim.enabled ? step * anim.stepMs : 0;
    const fadeAnim = anim.enabled
      ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.25s" fill="freeze" />`
      : "";
    const barAnim = anim.enabled
      ? `<animate attributeName="width" from="0" to="${barWidth}" begin="${animDelay / 1000 + 0.1}s" dur="0.5s" fill="freeze" />`
      : "";

    svg += `
      <g opacity="${anim.enabled ? "0" : "1"}">
        ${fadeAnim}

        <text
          x="${START_X}"
          y="${y + 16}"
          fill="${foregroundColor}"
          font-family="Courier New, monospace"
          font-size="13"
        >
          ${escapeXml(item.label)}
        </text>

        <text
          x="${START_X + TOTAL_WIDTH}"
          y="${y + 16}"
          fill="#B11226"
          font-family="Courier New, monospace"
          font-size="13"
          font-weight="700"
          text-anchor="end"
        >
          ${pct.toFixed(1)}%
        </text>

        <rect
          x="${START_X}"
          y="${y + 22}"
          width="${TOTAL_WIDTH}"
          height="4"
          rx="2"
          fill="${BAR_TRACK}"
        />

        <rect
          x="${START_X}"
          y="${y + 22}"
          width="${barWidth}"
          height="4"
          rx="2"
          fill="${BAR_FILL}"
        >
          ${barAnim}
        </rect>
      </g>
    `;

    y += ROW_HEIGHT + ROW_GAP;
    step += 1;
  }

  return { svg, height: items.length * (ROW_HEIGHT + ROW_GAP), endStep: step };
}
