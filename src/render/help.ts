import { escapeXml } from "./text";
import { renderCursor } from "./cursor";
import { getTheme, listThemes } from "../themes";

export function renderHelp(width: number = 680, height: number = 580): string {
  const theme = getTheme();
  const themes = listThemes();

  let y = 75;
  const lineHeight = 18;

  let body = "";

  body += renderText("$ github-stats --help", 28, y, theme.muted, 13, "600");
  y += 30;

  body += renderText("USAGE", 28, y, theme.accent, 12, "700");
  y += lineHeight;
  body += renderText("/api/terminal?username=<user>", 28, y, theme.foreground, 12);
  y += 30;

  body += renderText("PARAMS", 28, y, theme.accent, 12, "700");
  y += lineHeight;
  body += renderText("username  GitHub login (required)", 28, y, theme.muted, 12);
  y += lineHeight;
  body += renderText("cmd       whoami,manifest,stats,languages,projects,contact", 28, y, theme.muted, 12);
  y += lineHeight;
  body += renderText("theme     github (default), dracula, white, cappuccino", 28, y, theme.muted, 12);
  y += lineHeight;
  body += renderText("speed     slow, normal, fast, instant", 28, y, theme.muted, 12);
  y += lineHeight;
  body += renderText("noanimation  true / false", 28, y, theme.muted, 12);
  y += 30;

  body += renderText("THEMES", 28, y, theme.accent, 12, "700");
  y += lineHeight;
  body += renderText(themes.join("  \u00b7  "), 28, y, theme.foreground, 12);
  y += 30;

  body += renderText("EXAMPLE", 28, y, theme.accent, 12, "700");
  y += lineHeight;
  body += renderText("/api/terminal?username=GuilhermeNantes&theme=dracula", 28, y, theme.foreground, 12);
  y += 30;

  body += renderCursor(28, y, theme.accent);

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

      <circle cx="38" cy="36" r="5" fill="${theme.windowButton}" />
      <circle cx="54" cy="36" r="5" fill="${theme.windowButton}" />
      <circle cx="70" cy="36" r="5" fill="${theme.windowButton}" />

      ${body}

    </svg>
  `;
}

function renderText(text: string, x: number, y: number, color: string, fontSize: number, fontWeight?: string): string {
  const weight = fontWeight ? `font-weight="${fontWeight}"` : "";
  return `
    <text
      x="${x}"
      y="${y}"
      fill="${color}"
      font-family="Courier New, monospace"
      font-size="${fontSize}"
      ${weight}
    >
      ${escapeXml(text)}
    </text>
  `;
}
