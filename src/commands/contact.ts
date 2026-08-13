import type { CommandContext, CommandResult } from "../types";

export function contact(context: CommandContext): CommandResult {
  const login = context.profile?.user.login ?? context.config.username;
  const linkedinHandle = context.config.username.toLowerCase();

  return {
    command: "contact",
    title: "$ cat contact.txt",
    lines: [
      `github.com/${login}  ·  linkedin.com/in/${linkedinHandle}`,
    ],
    highlights: [0],
    link: `https://github.com/${login}`,
  };
}
