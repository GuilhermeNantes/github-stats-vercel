import type { CommandContext, CommandName, CommandResult } from "../types";

import { whoami } from "./whoami";
import { manifest } from "./manifest";
import { gitlog } from "./gitlog";
import { projects } from "./projects";
import { stats } from "./stats";
import { languages } from "./languages";
import { contributions } from "./contributions";
import { contact } from "./contact";

type CommandHandler = (context: CommandContext) => CommandResult;

export const commands: Record<CommandName, CommandHandler> = {
  whoami,
  manifest,
  gitlog,
  projects,
  stats,
  languages,
  contributions,
  contact,
};

export function executeCommands(
  commandNames: CommandName[],
  context: CommandContext,
): CommandResult[] {
  return commandNames
    .filter((command) => !context.config.hidden.includes(command))
    .map((command) => commands[command](context));
}
