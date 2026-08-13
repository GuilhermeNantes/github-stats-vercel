const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DonutOptions {
  centerLabel?: string;
  centerValue?: string;
  centerSubLabel?: string;
  showLegend?: boolean;
}

export interface DonutAnim {
  enabled: boolean;
  stepMs: number;
  startStep: number;
}

export function renderDonut(
  slices: DonutSlice[],
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  options: DonutOptions = {},
  anim: DonutAnim = { enabled: false, stepMs: 0, startStep: 0 },
): { svg: string; width: number; height: number; endStep: number } {
  if (slices.length === 0) return { svg: "", width: 0, height: 0, endStep: anim.startStep };

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return { svg: "", width: 0, height: 0, endStep: anim.startStep };

  let svg = "";
  let angle = -Math.PI / 2;
  let step = anim.startStep;

  for (const slice of slices) {
    const ratio = slice.value / total;
    const next = angle + ratio * Math.PI * 2;

    const x1 = cx + outerRadius * Math.cos(angle);
    const y1 = cy + outerRadius * Math.sin(angle);
    const x2 = cx + outerRadius * Math.cos(next);
    const y2 = cy + outerRadius * Math.sin(next);

    const ix1 = cx + innerRadius * Math.cos(angle);
    const iy1 = cy + innerRadius * Math.sin(angle);
    const ix2 = cx + innerRadius * Math.cos(next);
    const iy2 = cy + innerRadius * Math.sin(next);

    const largeArc = ratio > 0.5 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    const animDelay = anim.enabled ? step * anim.stepMs : 0;
    const fadeAnim = anim.enabled
      ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.4s" fill="freeze" />`
      : "";

    svg += `
      <path d="${pathData}" fill="${slice.color}" opacity="${anim.enabled ? "0" : "1"}">
        ${fadeAnim}
      </path>
    `;

    angle = next;
    step += 1;
  }

  if (options.centerValue) {
    svg += `
      <text
        x="${cx}"
        y="${cy + 5}"
        fill="${options.centerLabel || "#888"}"
        font-family="Courier New, monospace"
        font-size="20"
        font-weight="700"
        text-anchor="middle"
      >
        ${escapeXml(options.centerValue)}
      </text>
    `;
  }

  if (options.centerLabel) {
    svg += `
      <text
        x="${cx}"
        y="${cy - 14}"
        fill="#888"
        font-family="Courier New, monospace"
        font-size="10"
        text-anchor="middle"
        letter-spacing="1"
      >
        ${escapeXml(options.centerLabel.toUpperCase())}
      </text>
    `;
  }

  if (options.centerSubLabel) {
    svg += `
      <text
        x="${cx}"
        y="${cy + 22}"
        fill="#888"
        font-family="Courier New, monospace"
        font-size="10"
        text-anchor="middle"
      >
        ${escapeXml(options.centerSubLabel)}
      </text>
    `;
  }

  let legendX = cx + outerRadius + 24;
  let legendY = cy - (slices.length * 18) / 2;

  if (options.showLegend !== false) {
    for (const slice of slices) {
      const pct = ((slice.value / total) * 100).toFixed(1);
      const animDelay = anim.enabled ? step * anim.stepMs : 0;
      const fadeAnim = anim.enabled
        ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.3s" fill="freeze" />`
        : "";

      svg += `
        <g opacity="${anim.enabled ? "0" : "1"}">
          ${fadeAnim}
          <rect
            x="${legendX}"
            y="${legendY - 8}"
            width="10"
            height="10"
            rx="2"
            fill="${slice.color}"
          />
          <text
            x="${legendX + 16}"
            y="${legendY}"
            fill="#CCCCCC"
            font-family="Courier New, monospace"
            font-size="11"
          >
            ${escapeXml(slice.label)} ${pct}%
          </text>
        </g>
      `;

      legendY += 18;
      step += 1;
    }
  }

  const width = options.showLegend === false
    ? outerRadius * 2
    : legendX + 200;
  const height = outerRadius * 2 + 20;

  return { svg, width, height, endStep: step };
}

export function renderProgressRing(
  cx: number,
  cy: number,
  radius: number,
  value: number,
  max: number,
  color: string,
  trackColor: string,
  centerText: string,
  anim: DonutAnim = { enabled: false, stepMs: 0, startStep: 0 },
): { svg: string; endStep: number } {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const circumference = 2 * Math.PI * radius;
  const dashLength = circumference * ratio;
  const gapLength = circumference - dashLength;

  const animDelay = anim.enabled ? anim.startStep * anim.stepMs : 0;
  const dashAnim = anim.enabled
    ? `<animate attributeName="stroke-dasharray" from="0 ${circumference}" to="${dashLength} ${gapLength}" begin="${animDelay / 1000 + 0.2}s" dur="0.7s" fill="freeze" />`
    : "";

  const svg = `
    <circle
      cx="${cx}"
      cy="${cy}"
      r="${radius}"
      fill="none"
      stroke="${trackColor}"
      stroke-width="6"
      opacity="0.2"
    />
    <circle
      cx="${cx}"
      cy="${cy}"
      r="${radius}"
      fill="none"
      stroke="${color}"
      stroke-width="6"
      stroke-dasharray="${dashLength} ${gapLength}"
      stroke-linecap="round"
      transform="rotate(-90 ${cx} ${cy})"
    >
      ${dashAnim}
    </circle>
    <text
      x="${cx}"
      y="${cy + 5}"
      fill="${color}"
      font-family="Courier New, monospace"
      font-size="16"
      font-weight="700"
      text-anchor="middle"
    >
      ${escapeXml(centerText)}
    </text>
  `;

  return { svg, endStep: anim.startStep + 1 };
}
