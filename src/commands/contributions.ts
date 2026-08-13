import type { CommandContext, CommandResult } from "../types";

export function contributions(context: CommandContext): CommandResult {
  const user = context.profile?.user;
  if (!user) {
    return {
      command: "contributions",
      title: "$ git contributions --last=12weeks",
      lines: ["data unavailable"],
    };
  }

  const heatmap = generateMockHeatmap();

  const total = heatmap.flat().reduce((sum, day) => sum + day, 0);
  const activeDays = heatmap.flat().filter((d) => d > 0).length;

  return {
    command: "contributions",
    title: "$ git contributions --last=12weeks",
    heatmap,
    lines: [
      `${total} contributions in last 12 weeks`,
      `${activeDays} active days`,
      `best: ${Math.max(...heatmap.flat())} in a single day`,
    ],
  };
}

function generateMockHeatmap(): number[][] {
  const weeks = 12;
  const days = 7;
  const grid: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const weekend = d === 0 || d === 6;
      const noise = Math.random();
      const base = weekend ? 0.2 : 0.6;
      const value = Math.floor((base + noise * 0.4) * 8);
      week.push(Math.min(value, 8));
    }
    grid.push(week);
  }

  return grid;
}
