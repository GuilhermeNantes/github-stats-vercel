import type { CommandContext, CommandResult } from "../types";

export function whoami(context: CommandContext): CommandResult {
  const user = context.profile?.user;
  const login = user?.login ?? context.config.username;
  const role = context.config.role;

  return {
    command: "whoami",
    title: "$ whoami",
    lines: [`${login} — ${role.toLowerCase()}`],
    highlights: [0],
  };
}
