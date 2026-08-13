interface TerminalTheme {
  background: string;
  border: string;
  windowButton: string;
}

export function renderTerminal(width: number, height: number, theme: TerminalTheme): string {
  return `
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
  `;
}
