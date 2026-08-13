const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";
const ENT_QUOT = String.fromCharCode(38) + "quot;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT)
    .replace(/"/g, ENT_QUOT);
}

export interface RepoRow {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks?: number;
  updated_at?: string;
}

const ROW_X = 28;
const CARD_WIDTH = 624;
const FONT_SIZE = 12;
const CARD_HEIGHT = 70;
const CARD_GAP = 10;

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
  Lua: "#000080",
  Dart: "#00B4AB",
  Elixir: "#6E4A7E",
  Haskell: "#5E5086",
};

export function languageColor(language: string | null): string {
  if (!language) return "#888888";
  return LANG_COLORS[language] ?? "#888888";
}

export function renderReposTable(
  repos: RepoRow[],
  startY: number,
  mutedColor: string,
  foregroundColor: string,
  accentColor: string,
  borderColor: string,
): { svg: string; height: number } {
  if (repos.length === 0) return { svg: "", height: 0 };

  const totalWidth = 680;
  let svg = "";
  let y = startY;

  svg += `
    <text
      x="${ROW_X}"
      y="${y}"
      fill="${mutedColor}"
      font-family="Courier New, monospace"
      font-size="10"
      letter-spacing="1"
    >
      ${"REPOSITORIES".padEnd(20)}${"LANGUAGE".padEnd(20)}METRICS
    </text>
  `;
  y += 16;

  svg += `
    <line
      x1="${ROW_X}"
      y1="${y - 6}"
      x2="${totalWidth - ROW_X}"
      y2="${y - 6}"
      stroke="${accentColor}"
      stroke-width="1"
      opacity="0.5"
    />
  `;

  for (const repo of repos) {
    const cardY = y;
    const langColor = languageColor(repo.language);

    svg += `
      <rect
        x="${ROW_X}"
        y="${cardY}"
        width="${CARD_WIDTH}"
        height="${CARD_HEIGHT}"
        rx="6"
        fill="${mutedColor}"
        opacity="0.06"
      />

      <rect
        x="${ROW_X}"
        y="${cardY}"
        width="3"
        height="${CARD_HEIGHT}"
        rx="2"
        fill="${accentColor}"
      />
    `;

    svg += `
      <text
        x="${ROW_X + 14}"
        y="${cardY + 20}"
        fill="${accentColor}"
        font-family="Courier New, monospace"
        font-size="14"
        font-weight="700"
      >
        ${escapeXml(repo.name)}
      </text>
    `;

    if (repo.language) {
      const badgeX = ROW_X + 14;
      const badgeY = cardY + 28;
      const badgeText = repo.language;
      const badgeWidth = badgeText.length * 7 + 14;

      svg += `
        <rect
          x="${badgeX}"
          y="${badgeY}"
          width="${badgeWidth}"
          height="16"
          rx="8"
          fill="${langColor}"
          opacity="0.2"
        />
        <circle
          cx="${badgeX + 8}"
          cy="${badgeY + 8}"
          r="3"
          fill="${langColor}"
        />
        <text
          x="${badgeX + 16}"
          y="${badgeY + 12}"
          fill="${langColor}"
          font-family="Courier New, monospace"
          font-size="10"
          font-weight="600"
        >
          ${escapeXml(badgeText)}
        </text>
      `;
    }

    if (repo.description) {
      const desc = repo.description.length > 70
        ? repo.description.slice(0, 67) + "..."
        : repo.description;
      svg += `
        <text
          x="${ROW_X + 14}"
          y="${cardY + 56}"
          fill="${mutedColor}"
          font-family="Courier New, monospace"
          font-size="11"
          font-style="italic"
        >
          ${escapeXml(desc)}
        </text>
      `;
    }

    const metricsX = ROW_X + CARD_WIDTH - 110;
    svg += `
      <text
        x="${metricsX}"
        y="${cardY + 24}"
        fill="#E3B341"
        font-family="Courier New, monospace"
        font-size="12"
        font-weight="700"
      >
        ${"★"} ${repo.stars}
      </text>
      <text
        x="${metricsX}"
        y="${cardY + 42}"
        fill="#A371F7"
        font-family="Courier New, monospace"
        font-size="12"
        font-weight="700"
      >
        ${"⑂"} ${repo.forks ?? 0}
      </text>
      <text
        x="${metricsX}"
        y="${cardY + 58}"
        fill="${mutedColor}"
        font-family="Courier New, monospace"
        font-size="9"
      >
        ${formatDate(repo.updated_at)}
      </text>
    `;

    y += CARD_HEIGHT + CARD_GAP;
  }

  return { svg, height: y - startY };
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
