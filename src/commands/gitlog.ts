import type { CommandContext, CommandResult } from "../types";

export function gitlog(context: CommandContext): CommandResult {
  const profile = context.profile;

  if (!profile || profile.commits.length === 0) {
    return {
      command: "gitlog",
      title: "$ git log --oneline --me",
      lines: ["no recent public commits"],
    };
  }

  return {
    command: "gitlog",
    title: "$ git log --oneline --me",
    lines: profile.commits.map((commit) => {
      const shortSha = commit.sha.slice(0, 7);
      const msg =
        commit.message.length > 50
          ? `${commit.message.slice(0, 47)}...`
          : commit.message;
      return `${shortSha}  ${msg}  (${commit.repo})`;
    }),
    highlights: profile.commits.map((_, index) => index),
  };
}
