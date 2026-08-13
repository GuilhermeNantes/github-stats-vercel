const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface LangBlock {
  label: string;
  value: number;
  color: string;
}

const START_X = 28;
const LABEL_WIDTH = 90;
const BAR_CHARS = 20;
const PERCENT_WIDTH = 50;
const ROW_HEIGHT = 22;
const ROW_GAP = 4;

const FULL_BLOCK = "\u2588";
const EMPTY_BLOCK = "\u2591";

export function renderLangBlocks(
  items: LangBlock[],
  startY: number,
  accentColor: string,
  mutedColor: string,
  foregroundColor: string,
  anim: { enabled: boolean; stepMs: number; startStep: number },
): { svg: string; height: number; endStep: number } {
  if (items.length === 0) return { svg: "", height: 0, endStep: anim.startStep };

  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return { svg: "", height: 0, endStep: anim.startStep };

  let svg = "";
  let y = startY;
  let step = anim.startStep;

  for (const item of items) {
    const pct = (item.value / total) * 100;
    const filledCount = Math.round((pct / 100) * BAR_CHARS);
    const emptyCount = BAR_CHARS - filledCount;

    const barChars = FULL_BLOCK.repeat(filledCount) + EMPTY_BLOCK.repeat(emptyCount);

    const animDelay = anim.enabled ? step * anim.stepMs : 0;
    const fadeAnim = anim.enabled
      ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.25s" fill="freeze" />`
      : "";
    const groupOpacity = anim.enabled ? "0" : "1";

    const labelX = START_X;
    const barX = START_X + LABEL_WIDTH;
    const percentX = START_X + LABEL_WIDTH + (BAR_CHARS * 8) + 12;
    const barWidth = BAR_CHARS * 8;
    const barClipId = `langbar-${Math.random().toString(36).slice(2, 8)}`;

    const barReveal = anim.enabled
      ? `
        <defs>
          <clipPath id="${barClipId}">
            <rect x="${barX}" y="${y + 4}" width="${barWidth}" height="14">
              <animate attributeName="width" from="0" to="${barWidth}" begin="${animDelay / 1000 + 0.15}s" dur="0.4s" fill="freeze" />
            </rect>
          </clipPath>
        </defs>
      `
      : "";

    const barClipAttr = anim.enabled ? `clip-path="url(#${barClipId})"` : "";

    svg += `
      ${barReveal}
      <g opacity="${groupOpacity}">
        ${fadeAnim}

        <text
          x="${labelX}"
          y="${y + 14}"
          fill="${foregroundColor}"
          font-family="Courier New, monospace"
          font-size="12"
        >
          ${escapeXml(item.label)}
        </text>

        <text
          x="${barX}"
          y="${y + 14}"
          fill="${accentColor}"
          font-family="Courier New, monospace"
          font-size="12"
          letter-spacing="0"
          ${barClipAttr}
        >
          ${escapeXml(barChars)}
        </text>

        <text
          x="${percentX}"
          y="${y + 14}"
          fill="${accentColor}"
          font-family="Courier New, monospace"
          font-size="12"
          font-weight="700"
        >
          ${pct.toFixed(0)}%
        </text>
      </g>
    `;

    y += ROW_HEIGHT + ROW_GAP;
    step += 1;
  }

  return { svg, height: items.length * (ROW_HEIGHT + ROW_GAP), endStep: step };
}
