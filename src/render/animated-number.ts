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

  const widthPerChar = fontSize * 0.6;
  const fullWidth = finalStr.length * widthPerChar;

  return `
    <g opacity="0">
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        begin="${beginSec}s"
        dur="0.01s"
        fill="freeze"
      />
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
      <rect
        x="${x}"
        y="${y - fontSize}"
        width="${fullWidth}"
        height="${fontSize + 4}"
        fill="${color}"
        opacity="0.0"
      >
        <animate
          attributeName="width"
          from="0"
          to="${fullWidth}"
          begin="${beginSec}s"
          dur="0.4s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          from="0.0"
          to="0.15"
          begin="${beginSec}s"
          dur="0.4s"
          fill="freeze"
        />
      </rect>
    </g>
  `;
}
