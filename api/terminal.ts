import type { VercelRequest, VercelResponse } from "@vercel/node";

import { getGitHubProfile } from "../src/github/client";
import { mockProfile } from "../src/github/mock";
import { executeCommands } from "../src/commands";
import { renderSvg } from "../src/render";
import { renderError } from "../src/render/error";
import { renderHelp } from "../src/render/help";
import {
  getUsername,
  isHelpMode,
  isMockMode,
  parseRequest,
  listAvailableCommands,
} from "../src/config/parser";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isHelpMode(req)) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(renderHelp());
    return;
  }

  const username = getUsername(req);

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(400).send(
      renderError(
        "Username is required",
        "Add &username={name} to the URL",
      ),
    );
    return;
  }

  const { config, unknownCommands } = parseRequest(req);
  config.username = username;

  const available = listAvailableCommands();

  if (unknownCommands.length > 0) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(400).send(
      renderError(
        `Unknown command${unknownCommands.length > 1 ? "s" : ""}: ${unknownCommands.join(", ")}`,
        "Check the available commands below",
        { unknownCommands, availableCommands: available },
      ),
    );
    return;
  }

  try {
    const profile = isMockMode(req)
      ? mockProfile
      : await getGitHubProfile(username);

    const results = executeCommands(config.commands, {
      config,
      profile,
    });

    const svg = renderSvg(results, config);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.status(200).send(svg);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown GitHub error";

    res.setHeader("Content-Type", "image/svg+xml");

    if (message.includes("not found")) {
      res.status(404).send(
        renderError(
          `User "${username}" not found`,
          "Check the GitHub username and try again",
          { showUsage: true },
        ),
      );
      return;
    }

    if (message.includes("rate limit")) {
      res.status(429).send(
        renderError(
          "GitHub API rate limit exceeded",
          "Try again in a few minutes, or configure GITHUB_TOKEN to lift the limit",
          { showUsage: true },
        ),
      );
      return;
    }

    res.status(500).send(
      renderError(
        message,
        "An unexpected error occurred",
        { showUsage: true },
      ),
    );
  }
}
