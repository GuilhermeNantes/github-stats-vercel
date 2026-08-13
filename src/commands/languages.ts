import type { CommandContext, CommandResult } from "../types";
import { languageColor } from "../render/repos";

export function languages(context: CommandContext): CommandResult {
  const profile = context.profile;

  if (!profile || Object.keys(profile.languages).length === 0) {
    return {
      command: "languages",
      title: "$ ./languages --top",
      lines: ["no language data available"],
    };
  }

  const entries = Object.entries(profile.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  return {
    command: "languages",
    title: "$ ./languages --top",
    langBlocks: entries.map(([name, bytes]) => ({
      label: name,
      value: bytes,
      color: languageColor(name),
    })),
    lines: [
      `total: ${formatBytes(total)} across ${entries.length} languages`,
      `tracked: ${profile.repos.length} repos`,
    ],
  };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} kB`;
  return `${bytes} B`;
}
