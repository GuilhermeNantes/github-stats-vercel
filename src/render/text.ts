const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";
const ENT_QUOT = String.fromCharCode(38) + "quot;";
const ENT_APOS = String.fromCharCode(38) + "apos;";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT)
    .replace(/"/g, ENT_QUOT)
    .replace(/'/g, ENT_APOS);
}

export interface TextOptions {
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
}

export function renderText(
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number = 13,
  options: TextOptions = {},
): string {
  const weight = options.fontWeight ? `font-weight="${options.fontWeight}"` : "";
  const style = options.fontStyle ? `font-style="${options.fontStyle}"` : "";
  return `
    <text
      x="${x}"
      y="${y}"
      fill="${color}"
      font-family="Courier New, monospace"
      font-size="${fontSize}"
      ${weight}
      ${style}
    >
      ${escapeXml(text)}
    </text>
  `;
}

export function renderTypingText(
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number,
  options: {
    startStep: number;
    stepDurationMs: number;
    fontWeight?: string | number;
  },
): string {
  const { startStep, stepDurationMs, fontWeight } = options;
  const safeText = escapeXml(text);

  if (text.length === 0) {
    return "";
  }

  const beginSec = (startStep * stepDurationMs) / 1000;
  const durSec = (text.length * stepDurationMs) / 1000;

  const widthPerChar = fontSize * 0.6;
  const fullWidth = text.length * widthPerChar;

  const weightAttr = fontWeight ? `font-weight="${fontWeight}"` : "";
  const clipId = `clip-${startStep}-${x}-${y}-${Math.random().toString(36).slice(2, 7)}`;

  return `
    <clipPath id="${clipId}">
      <rect
        x="${x}"
        y="${y - fontSize}"
        width="0"
        height="${fontSize + 4}"
      >
        <animate
          attributeName="width"
          from="0"
          to="${fullWidth}"
          begin="${beginSec}s"
          dur="${durSec}s"
          fill="freeze"
        />
      </rect>
    </clipPath>
    <text
      x="${x}"
      y="${y}"
      fill="${color}"
      font-family="Courier New, monospace"
      font-size="${fontSize}"
      ${weightAttr}
      clip-path="url(#${clipId})"
    >
      ${safeText}
    </text>
  `;
}
