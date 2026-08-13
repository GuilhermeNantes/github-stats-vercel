import type { CommandContext, CommandResult } from "../types";

export function manifest(_context: CommandContext): CommandResult {
  return {
    command: "manifest",
    title: "$ cat manifesto.txt",
    lines: [
      "simple over clever. maintainable over fast.",
      "tools that disappear into the workflow.",
      "if it can't be explained simply, redo it.",
    ],
  };
}
