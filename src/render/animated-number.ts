const ENT_AMP = String.fromCharCode(38) + "amp;";
const ENT_LT = String.fromCharCode(38) + "lt;";
const ENT_GT = String.fromCharCode(38) + "gt;";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, ENT_AMP)
    .replace(/</g, ENT_LT)
    .replace(/>/g, ENT_GT);
}

export interface AnimatedNumberOptions {
  beginSec: number;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  textAnchor?: "start" | "middle" | "end";
  enabled?: boolean;
}

export function animatedNumber(
  finalValue: number,
  x: number,
  y: number,
  color: string,
  options: AnimatedNumberOptions,
): string {
  const {
    beginSec,
    fontSize = 13,
    fontWeight = "700",
    fontFamily = "Courier New, monospace",
    textAnchor = "start",
    enabled = true,
  } = options;

  const finalStr = String(finalValue);
  const widthPerChar = fontSize * 0.6;
  const fullWidth = finalStr.length * widthPerChar;

  if (!enabled) {
    return `
      <text
        x="${x}"
        y="${y}"
        fill="${color}"
        font-family="${fontFamily}"
        font-size="${fontSize}"
        font-weight="${fontWeight}"
        text-anchor="${textAnchor}"
      >
        ${escapeXml(finalStr)}
      </text>
    `;
  }

  const clipId = `numclip-${Math.random().toString(36).slice(2, 9)}`;

  return `
    <defs>
      <clipPath id="${clipId}">
        <rect
          x="${x}"
          y="${y - fontSize}"
          width="${fullWidth}"
          height="${fontSize + 4}"
        >
          <animate
            attributeName="width"
            from="0"
            to="${fullWidth}"
            begin="${beginSec}s"
            dur="0.3s"
            fill="freeze"
          />
        </rect>
      </clipPath>
    </defs>
    <text
      x="${x}"
      y="${y}"
      fill="${color}"
      font-family="${fontFamily}"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      text-anchor="${textAnchor}"
      clip-path="url(#${clipId})"
    >
      ${escapeXml(finalStr)}
    </text>
  `;
}
