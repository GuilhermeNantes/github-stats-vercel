import type { TerminalConfig } from "../types";

export const defaultConfig: TerminalConfig = {
  username: "GuilhermeNantes",
  name: "Guilherme Nantes",
  role: "Software Developer",
  commands: ["whoami", "manifest", "stats", "languages", "projects", "contact"],
  theme: "dark",
  hidden: [],
  width: 680,
  height: 1300,
  noanimation: false,
  speed: "normal",
};
