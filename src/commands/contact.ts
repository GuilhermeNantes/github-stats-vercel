import type { CommandContext, CommandResult } from "../types";

export function contact(context: CommandContext): CommandResult {
  const login = context.profile?.user.login ?? context.config.username;
  const linkedin = context.config.username.toLowerCase();

  return {
    command: "contact",
    title: "$ cat contact.txt",
    lines: [
      `github.com/${login}  ·  linkedin.com/in/${linkedin}`,
    ],
    highlights: [0],
  };
}
