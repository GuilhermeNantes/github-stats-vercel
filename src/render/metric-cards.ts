const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface MetricCard {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

const CARD_PADDING = 14;
const CARD_GAP = 10;
const CARD_HEIGHT = 88;
const START_X = 28;
const TOTAL_WIDTH = 680 - START_X * 2;

export function renderMetricCards(
  metrics: MetricCard[],
  startY: number,
  mutedColor: string,
  foregroundColor: string,
  borderColor: string,
  anim: { enabled: boolean; stepMs: number; startStep: number },
): { svg: string; height: number; endStep: number } {
  if (metrics.length === 0) return { svg: "", height: 0, endStep: anim.startStep };

  const cardWidth = (TOTAL_WIDTH - CARD_GAP * (metrics.length - 1)) / metrics.length;
  let svg = "";
  let x = START_X;
  let step = anim.startStep;

  for (const metric of metrics) {
    const max = Math.max(metric.value, 1);
    const fillRatio = Math.min(metric.value / max, 1);
    const fillWidth = (cardWidth - CARD_PADDING * 2) * fillRatio;

    const animDelay = anim.enabled ? step * anim.stepMs : 0;
    const animDur = anim.enabled ? 0.6 : 0;

    const fadeAnim = anim.enabled
      ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.3s" fill="freeze" />`
      : "";
    const barAnim = anim.enabled
      ? `<animate attributeName="width" from="0" to="${fillWidth}" begin="${animDelay / 1000 + 0.2}s" dur="${animDur}s" fill="freeze" />`
      : "";

    svg += `
      <g opacity="${anim.enabled ? "0" : "1"}">
        ${fadeAnim}

        <rect
          x="${x}"
          y="${startY}"
          width="${cardWidth}"
          height="${CARD_HEIGHT}"
          rx="10"
          fill="${mutedColor}"
          opacity="0.08"
        />

        <rect
          x="${x}"
          y="${startY}"
          width="${cardWidth}"
          height="2"
          rx="1"
          fill="${metric.color}"
          opacity="0.7"
        />

        <rect
          x="${x}"
          y="${startY + CARD_HEIGHT - 3}"
          width="${fillWidth}"
          height="3"
          rx="1.5"
          fill="${metric.color}"
          opacity="0.9"
        >
          ${barAnim}
        </rect>

        <text
          x="${x + CARD_PADDING}"
          y="${startY + 24}"
          fill="${mutedColor}"
          font-family="Courier New, monospace"
          font-size="9"
          letter-spacing="2"
        >
          ${escapeXml(metric.label.toUpperCase())}
        </text>

        <text
          x="${x + CARD_PADDING}"
          y="${startY + 58}"
          fill="${metric.color}"
          font-family="Courier New, monospace"
          font-size="26"
          font-weight="700"
        >
          ${escapeXml(formatNumber(metric.value))}
        </text>
      </g>
    `;

    x += cardWidth + CARD_GAP;
    step += 1;
  }

  return { svg, height: CARD_HEIGHT, endStep: step };
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}k`;
  if (value >= 1_000) return value.toLocaleString("en-US");
  return String(value);
}
