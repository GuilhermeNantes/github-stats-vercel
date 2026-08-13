import { escapeXml } from "./text";
import { renderCursor } from "./cursor";
import { getTheme } from "../themes";
import { suggestSimilar } from "../config/suggest";

export interface ErrorOptions {
  width?: number;
  height?: number;
  unknownCommands?: string[];
  availableCommands?: string[];
  showUsage?: boolean;
}

export function renderError(
  message: string,
  suggestion: string,
  options: ErrorOptions = {},
): string {
  const theme = getTheme();
  const width = options.width ?? 680;
  const height = options.height ?? 420;

  const lines: { text: string; color: string; indent?: number }[] = [];
  lines.push({ text: "$ github-stats --help", color: theme.muted });
  lines.push({ text: "", color: theme.foreground });
  lines.push({ text: `[!] ${message}`, color: theme.accent, indent: 0 });
  lines.push({ text: `[?] ${suggestion}`, color: theme.muted, indent: 0 });

  if (options.unknownCommands && options.unknownCommands.length > 0) {
    lines.push({ text: "", color: theme.foreground });
    for (const unknown of options.unknownCommands) {
      const suggestion_ = options.availableCommands
        ? suggestSimilar(unknown, options.availableCommands)
        : null;
      lines.push({
        text: `$ ${unknown}`,
        color: theme.accent,
        indent: 0,
      });
      if (suggestion_) {
        lines.push({
          text: `[?] Did you mean: ${suggestion_} ?`,
          color: theme.muted,
          indent: 1,
        });
      }
    }
  }

  if (options.showUsage !== false) {
    lines.push({ text: "", color: theme.foreground });
    lines.push({ text: "Usage:", color: theme.foreground });
    lines.push({
      text: "/api/terminal?Username=GuilhermeNantes",
      color: theme.accent,
      indent: 1,
    });
    lines.push({ text: "", color: theme.foreground });
    lines.push({ text: "Options:", color: theme.foreground });
    lines.push({
      text: "&cmd=whoami,stats,languages",
      color: theme.muted,
      indent: 1,
    });
    lines.push({
      text: "&theme=dark | cupertino | dracula",
      color: theme.muted,
      indent: 1,
    });
    lines.push({
      text: "&speed=slow | normal | fast | instant",
      color: theme.muted,
      indent: 1,
    });
    lines.push({
      text: "&noanimation=true",
      color: theme.muted,
      indent: 1,
    });
    lines.push({
      text: "&hide=manifest,contact",
      color: theme.muted,
      indent: 1,
    });
  }

  let y = 82;
  const lineHeight = 18;
  let body = "";

  for (const line of lines) {
    const x = 28 + (line.indent ?? 0) * 16;
    body += `
      <text
        x="${x}"
        y="${y}"
        fill="${line.color}"
        font-family="Courier New, monospace"
        font-size="13"
      >
        ${escapeXml(line.text)}
      </text>
    `;
    y += lineHeight;
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >

      <rect
        width="${width}"
        height="${height}"
        rx="14"
        fill="${theme.background}"
      />

      <rect
        x="0.5"
        y="0.5"
        width="${width - 1}"
        height="${height - 1}"
        rx="14"
        fill="none"
        stroke="${theme.border}"
      />

      <circle
        cx="38"
        cy="36"
        r="5"
        fill="${theme.windowButton}"
      />

      <circle
        cx="54"
        cy="36"
        r="5"
        fill="${theme.windowButton}"
      />

      <circle
        cx="70"
        cy="36"
        r="5"
        fill="${theme.windowButton}"
      />

      ${body}

      ${renderCursor(28, y + 6, theme.accent)}

    </svg>
  `;
}
