export function suggestSimilar(target: string, options: string[]): string | null {
  if (options.length === 0) return null;
  let best: { option: string; distance: number } | null = null;
  for (const option of options) {
    const distance = levenshtein(target.toLowerCase(), option.toLowerCase());
    if (best === null || distance < best.distance) {
      best = { option, distance };
    }
  }
  if (!best) return null;
  return best.distance <= Math.max(2, Math.floor(target.length / 2))
    ? best.option
    : null;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = Array.from({ length: b.length + 1 }, () =>
    new Array(a.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost,
      );
    }
  }
  return matrix[b.length][a.length];
}
