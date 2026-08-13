import { cappuccinoTheme } from "./cappuccino";
import { cupertinoTheme } from "./cupertino";
import { draculaTheme } from "./dracula";
import { githubTheme } from "./github";
import { whiteTheme } from "./white";

export type ThemeName =
  | "dark"
  | "github"
  | "cupertino"
  | "dracula"
  | "white"
  | "cappuccino";

export interface Theme {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  border: string;
  windowButton: string;
}

const themes: Record<ThemeName, Theme> = {
  dark: githubTheme as Theme,
  github: githubTheme,
  cupertino: cupertinoTheme,
  dracula: draculaTheme,
  white: whiteTheme,
  cappuccino: cappuccinoTheme,
};

export function getTheme(name: string = "dark"): Theme {
  if (name in themes) {
    return themes[name as ThemeName];
  }
  return themes.dark;
}

export function listThemes(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}
