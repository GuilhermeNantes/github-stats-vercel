const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface ProjectPill {
  name: string;
  language: string | null;
  html_url?: string;
}

const START_X = 28;
const MAX_WIDTH = 680 - START_X * 2;
const PILL_HEIGHT = 28;
const PILL_GAP = 8;
const PILL_PADDING_X = 12;
const FONT_SIZE = 12;

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#F34B7D",
  C: "#555555",
  "C#": "#178600",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
};

export function languageShortColor(language: string | null): string {
  if (!language) return "#666666";
  return LANG_COLORS[language] ?? "#666666";
}

export function renderProjectPills(
  projects: ProjectPill[],
  startY: number,
  anim: { enabled: boolean; stepMs: number; startStep: number },
): { svg: string; height: number; endStep: number } {
  if (projects.length === 0) return { svg: "", height: 0, endStep: anim.startStep };

  let svg = "";
  let x = START_X;
  let y = startY;
  let step = anim.startStep;
  let maxRowBottom = y;

  for (const proj of projects) {
    const langLabel = proj.language ?? "—";
    const langShort = proj.language?.toLowerCase() ?? "";

    const charWidth = FONT_SIZE * 0.6;
    const text = `${proj.name} · ${langShort}`;
    const textWidth = text.length * charWidth;
    const pillWidth = textWidth + PILL_PADDING_X * 2;

    if (x + pillWidth > START_X + MAX_WIDTH) {
      x = START_X;
      y += PILL_HEIGHT + PILL_GAP;
    }

    const animDelay = anim.enabled ? step * anim.stepMs : 0;
    const fadeAnim = anim.enabled
      ? `<animate attributeName="opacity" from="0" to="1" begin="${animDelay / 1000}s" dur="0.3s" fill="freeze" />`
      : "";

    const inner = `
      <g opacity="${anim.enabled ? "0" : "1"}">
        ${fadeAnim}

        <rect
          x="${x}"
          y="${y}"
          width="${pillWidth}"
          height="${PILL_HEIGHT}"
          rx="6"
          fill="none"
          stroke="#333333"
          stroke-width="1"
        />

        <text
          x="${x + PILL_PADDING_X}"
          y="${y + 18}"
          fill="#cccccc"
          font-family="Courier New, monospace"
          font-size="${FONT_SIZE}"
          font-weight="600"
        >
          ${escapeXml(proj.name)}
          <tspan fill="#666666" font-weight="400"> · ${escapeXml(langShort)}</tspan>
        </text>
      </g>
    `;

    if (proj.html_url) {
      svg += `
        <a href="${escapeXml(proj.html_url)}" target="_blank" rel="noopener noreferrer">
          ${inner}
        </a>
      `;
    } else {
      svg += inner;
    }

    x += pillWidth + PILL_GAP;
    maxRowBottom = y + PILL_HEIGHT;
    step += 1;
  }

  const totalHeight = maxRowBottom - startY + 4;

  return { svg, height: totalHeight, endStep: step };
}
