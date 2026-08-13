export function renderCursor(x: number, y: number, color: string): string {
  return `
    <rect
      x="${x}"
      y="${y - 14}"
      width="8"
      height="15"
      fill="${color}"
    >
      <animate
        attributeName="opacity"
        values="1;0;1"
        dur="1s"
        repeatCount="indefinite"
      />
    </rect>
  `;
}
