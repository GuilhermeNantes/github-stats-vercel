import type { CommandContext, CommandResult } from "../types";

const FALLBACK_PROJECTS = [
  { name: "forge", lang: "go" },
  { name: "gestur", lang: "next.js" },
  { name: "inferno-de-dantes", lang: "react" },
];

export function projects(context: CommandContext): CommandResult {
  const profile = context.profile;

  let items: { name: string; language: string | null; html_url: string }[] = [];

  if (profile && profile.repos.length > 0) {
    items = profile.repos
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        language: repo.language,
        html_url: repo.html_url,
      }));
  } else {
    items = FALLBACK_PROJECTS.map((p) => ({
      name: p.name,
      language: p.lang,
      html_url: "",
    }));
  }

  return {
    command: "projects",
    title: "$ ls ./projects --top",
    projects: items,
    lines: [
      items.length > 0
        ? `showing ${items.length} of ${profile?.repos.length ?? items.length} repos`
        : "no projects found",
    ],
  };
}
