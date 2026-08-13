import type {
  GitHubCommit,
  GitHubLanguages,
  GitHubProfile,
  GitHubRepo,
  GitHubUser,
} from "../types";

const GITHUB_API = "https://api.github.com";

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-stats-vercel",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token && token !== "ghp_COLE_SEU_TOKEN_AQUI") {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function gh<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: buildHeaders(),
  });

  if (response.status === 404) {
    throw new Error(`GitHub resource not found: ${path}`);
  }

  if (response.status === 403) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new Error("GitHub API rate limit exceeded. Add GITHUB_TOKEN to lift the limit.");
    }
    throw new Error("GitHub API forbidden (403)");
  }

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  try {
    return await gh<GitHubUser>(`/users/${encodeURIComponent(username)}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    throw error;
  }
}

export async function getGitHubRepos(
  username: string,
  limit: number = 100,
): Promise<GitHubRepo[]> {
  const repos = await gh<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=${limit}&sort=updated`,
  );
  return repos.filter((repo) => !repo.fork && !repo.archived);
}

export async function getGitHubLanguages(
  username: string,
  limit: number = 30,
): Promise<GitHubLanguages> {
  const repos = await getGitHubRepos(username, limit);
  const totals: GitHubLanguages = {};

  for (const repo of repos) {
    if (!repo.language) continue;
    try {
      const repoLangs = await gh<GitHubLanguages>(
        `/repos/${repo.full_name}/languages`,
      );
      for (const [lang, bytes] of Object.entries(repoLangs)) {
        totals[lang] = (totals[lang] ?? 0) + bytes;
      }
    } catch {
      continue;
    }
  }

  return totals;
}

export async function getGitHubCommits(
  username: string,
  limit: number = 8,
): Promise<GitHubCommit[]> {
  const events = await gh<Array<Record<string, unknown>>>(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`,
  );

  const commits: GitHubCommit[] = [];

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const payload = event.payload as {
      commits?: Array<{ sha: string; message: string }>;
      ref?: string;
    };
    const repo = (event.repo as { name?: string })?.name ?? "unknown";
    if (!payload.commits) continue;

    for (const commit of payload.commits) {
      commits.push({
        sha: commit.sha,
        message: commit.message.split("\n")[0] ?? commit.message,
        date: (event.created_at as string) ?? new Date().toISOString(),
        repo: repo.split("/")[1] ?? repo,
      });
      if (commits.length >= limit) break;
    }
    if (commits.length >= limit) break;
  }

  return commits;
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  const [user, repos, languages, commits] = await Promise.all([
    getGitHubUser(username),
    getGitHubRepos(username).catch(() => [] as GitHubRepo[]),
    getGitHubLanguages(username).catch(() => ({} as GitHubLanguages)),
    getGitHubCommits(username).catch(() => [] as GitHubCommit[]),
  ]);

  return { user, repos, languages, commits };
}
