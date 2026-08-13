export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
  updated_at: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  date: string;
  repo: string;
}

export interface GitHubProfile {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: GitHubLanguages;
  commits: GitHubCommit[];
}

export type CommandName = string;

export interface TerminalConfig {
  username: string;
  name: string;
  role: string;

  commands: CommandName[];

  theme: string;

  hidden: string[];

  width: number;
  height?: number;

  noanimation: boolean;

  speed: "slow" | "normal" | "fast" | "instant";
}

export interface CommandContext {
  config: TerminalConfig;

  profile?: GitHubProfile;
}

export interface CommandResult {
  command: CommandName;

  title: string;

  lines: string[];

  highlights?: number[];

  link?: string;

  bars?: { label: string; value: number; max: number; color: string }[];

  segments?: { label: string; value: number; color: string }[];

  rows?: { cells: { text: string; color?: string; animated?: boolean }[] }[];

  repos?: {
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks?: number;
    updated_at?: string;
  }[];

  donut?: {
    slices: { label: string; value: number; color: string }[];
    centerLabel?: string;
    centerValue?: string;
    centerSubLabel?: string;
    layout?: "horizontal" | "centered";
  };

  rings?: {
    label: string;
    value: number;
    max: number;
    color: string;
    centerText: string;
  }[];

  heatmap?: number[][];

  metrics?: { label: string; value: number; color: string; icon?: string }[];

  langPills?: { label: string; value: number; color: string }[];

  langBlocks?: { label: string; value: number; color: string }[];

  projects?: { name: string; language: string | null; html_url?: string }[];
}
