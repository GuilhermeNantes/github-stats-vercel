const fs = require("node:fs");
const http = require("node:http");
const url = require("node:url");

const envPath = "/home/guilhermebergamo/Projetos/github-stats-vercel/.env.local";
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1).replace(/^"|"$/g, "");
  }
}

const PORT = 3000;

async function handle(req, res) {
  const parsed = url.parse(req.url, true);
  const fakeReq = { query: parsed.query };

  const { getUsername, isMockMode, isHelpMode, parseRequest, listAvailableCommands } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/config/parser.ts"
  );
  const { executeCommands } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/commands/index.ts"
  );
  const { renderSvg } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/render/index.ts"
  );
  const { renderError } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/render/error.ts"
  );
  const { getGitHubProfile } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/github/client.ts"
  );
  const { mockProfile } = await import(
    "/home/guilhermebergamo/Projetos/github-stats-vercel/src/github/mock.ts"
  );

  const username = getUsername(fakeReq);

  if (isHelpMode(fakeReq)) {
    const { renderHelp } = await import(
      "/home/guilhermebergamo/Projetos/github-stats-vercel/src/render/help.ts"
    );
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.statusCode = 200;
    res.end(renderHelp());
    return;
  }

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.statusCode = 400;
    res.end(renderError("Username is required", "Add &username={name} to the URL"));
    return;
  }

  const { config, unknownCommands } = parseRequest(fakeReq);
  config.username = username;

  if (unknownCommands.length > 0) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.statusCode = 400;
    res.end(
      renderError(
        `Unknown command${unknownCommands.length > 1 ? "s" : ""}: ${unknownCommands.join(", ")}`,
        "Check the available commands below",
        { unknownCommands, availableCommands: listAvailableCommands() }
      )
    );
    return;
  }

  try {
    const profile = isMockMode(fakeReq) ? mockProfile : await getGitHubProfile(username);
    const results = executeCommands(config.commands, { config, profile });
    const svg = renderSvg(results, config);
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Data-Source", isMockMode(fakeReq) ? "mock" : "github");
    res.statusCode = 200;
    res.end(svg);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub error";
    console.error("[ERROR]", message);
    res.setHeader("Content-Type", "image/svg+xml");
    res.statusCode = 404;
    res.end(renderError(message, "Check the GitHub username and try again", { showUsage: true }));
  }
}

http
  .createServer((req, res) => {
    handle(req, res).catch((err) => {
      console.error("ERR:", err);
      res.statusCode = 500;
      res.end("Internal error: " + (err?.message || String(err)));
    });
  })
  .listen(PORT, () => {
    console.log(`>>> http://localhost:${PORT}/api/terminal`);
    console.log(`>>> Token: ${process.env.GITHUB_TOKEN ? "loaded" : "MISSING"}`);
  });
