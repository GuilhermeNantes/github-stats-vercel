import type { CommandContext, CommandResult } from "../types";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const m = d.toLocaleDateString("en-US", { month: "short" });
  return `${m} ${d.getDate()}`;
}

export function gitlog(context: CommandContext): CommandResult {
  const profile = context.profile;

  if (!profile || profile.commits.length === 0) {
    return {
      command: "gitlog",
      title: "$ git log --oneline -5 --me",
      lines: [
        "no recent public push events",
        "(api only returns last 90 days)",
      ],
    };
  }

  const lines = profile.commits.slice(0, 5).map((commit) => {
    const shortSha = commit.sha.slice(0, 7);
    const msg =
      commit.message.length > 38
        ? `${commit.message.slice(0, 35)}...`
        : commit.message.padEnd(38, " ");
    const date = fmtDate(commit.date);
    return `${shortSha}  ${msg}  ${date}  ${commit.repo}`;
  });

  return {
    command: "gitlog",
    title: "$ git log --oneline -5 --me",
    lines,
    highlights: profile.commits.slice(0, 5).map((_, index) => index),
  };
}
