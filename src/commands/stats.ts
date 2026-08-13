import type { CommandContext, CommandResult } from "../types";

export function stats(context: CommandContext): CommandResult {
  const profile = context.profile;

  if (!profile) {
    return {
      command: "stats",
      title: "$ github --stats",
      lines: ["profile unavailable"],
    };
  }

  const totalStars = profile.repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const totalForks = profile.repos.reduce(
    (sum, repo) => sum + repo.forks_count,
    0,
  );

  const rows = [
    ["repos", String(profile.user.public_repos)],
    ["stars", String(totalStars)],
    ["forks", String(totalForks)],
    ["followers", String(profile.user.followers)],
    ["following", String(profile.user.following)],
  ];

  const labelWidth = Math.max(...rows.map(([l]) => l.length));

  return {
    command: "stats",
    title: "$ github --stats",
    rows: rows.map(([label, value]) => ({
      cells: [
        { text: label.padEnd(labelWidth + 2), color: "#888888" },
        { text: value, color: "#B11226", animated: true },
      ],
    })),
    lines: [
      `top repo: ${topRepo(profile.repos)}`,
      `account age: ${accountAge(profile.user.created_at)}`,
    ],
  };
}

function topRepo(repos: { name: string; stargazers_count: number }[]): string {
  if (repos.length === 0) return "none";
  const best = repos.reduce(
    (best, repo) => (repo.stargazers_count > best.stargazers_count ? repo : best),
    repos[0],
  );
  return best.stargazers_count > 0 ? `${best.name} (${best.stargazers_count}★)` : best.name;
}

function accountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  return `${years}y`;
}
