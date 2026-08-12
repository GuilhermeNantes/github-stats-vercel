// api/stats.js
// Endpoint: /api/stats?username=SEU_USUARIO
// Busca dados reais do GitHub (via GraphQL) e devolve um SVG estilo terminal.

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    login
    followers { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        primaryLanguage { name color }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
    }
  }
}
`;

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSvg({ login, stars, commits, prs, repos, followers, topLangs }) {
  const langRows = topLangs
    .map((lang, i) => {
      const y = 40 + i * 26;
      const barWidth = Math.max(4, lang.pct * 1.6); // escala simples
      return `
        <text x="0" y="${y}" class="boxtext">${escapeXml(lang.name)}</text>
        <text x="230" y="${y}" class="dim" text-anchor="end">${lang.pct}%</text>
        <rect x="0" y="${y + 6}" width="230" height="6" rx="3" fill="#222" />
        <rect x="0" y="${y + 6}" width="${barWidth}" height="6" rx="3" fill="#B11226" />
      `;
    })
    .join("");

  return `
<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #0B0B0B; }
      .border { fill: none; stroke: #2a2a2a; stroke-width: 1; }
      .dot { fill: #444; }
      .cmd { fill: #888; font-family: 'Courier New', monospace; font-size: 13px; }
      .accent { fill: #B11226; font-family: 'Courier New', monospace; font-size: 15px; font-weight: 600; }
      .text { fill: #cccccc; font-family: 'Courier New', monospace; font-size: 13px; }
      .dim { fill: #666666; font-family: 'Courier New', monospace; font-size: 11px; }
      .boxtext { fill: #cccccc; font-family: 'Courier New', monospace; font-size: 12px; }
      @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      .cursor { animation: blink 1s step-start infinite; }
    </style>
  </defs>

  <rect x="1" y="1" width="678" height="418" rx="14" class="bg" />
  <rect x="1" y="1" width="678" height="418" rx="14" class="border" />

  <circle cx="32" cy="32" r="6" class="dot" />
  <circle cx="52" cy="32" r="6" class="dot" />
  <circle cx="72" cy="32" r="6" class="dot" />

  <text x="28" y="70" class="cmd">$ whoami</text>
  <text x="28" y="94" class="accent">${escapeXml(login)} — software developer</text>

  <text x="28" y="130" class="cmd">$ ./stats --real-time</text>

  <text x="28" y="156" class="text">commits <tspan fill="#B11226">${commits}</tspan>   pull requests <tspan fill="#B11226">${prs}</tspan></text>
  <text x="28" y="178" class="text">repositories <tspan fill="#B11226">${repos}</tspan>   stars <tspan fill="#B11226">${stars}</tspan>   followers <tspan fill="#B11226">${followers}</tspan></text>

  <text x="28" y="216" class="cmd">$ ls --languages --sort=used</text>

  <g transform="translate(28, 226)">
    ${langRows}
  </g>

  <text x="28" y="392" class="cmd">$ <tspan class="cursor" fill="#B11226">▌</tspan></text>
</svg>`.trim();
}

export default async function handler(req, res) {
  try {
    const username = (req.query.username || "").trim();
    if (!username) {
      res.status(400).send("Faltou o parametro ?username=");
      return;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      res.status(500).send("GITHUB_TOKEN nao configurado no Vercel.");
      return;
    }

    const ghRes = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    });

    const json = await ghRes.json();
    const user = json?.data?.user;

    if (!user) {
      res.status(404).send("Usuario nao encontrado ou token invalido.");
      return;
    }

    const repos = user.repositories.nodes;
    const stars = repos.reduce((acc, r) => acc + (r.stargazerCount || 0), 0);

    const langCount = {};
    repos.forEach((r) => {
      const name = r.primaryLanguage?.name;
      if (name) langCount[name] = (langCount[name] || 0) + 1;
    });
    const totalLangHits = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / totalLangHits) * 100),
      }));

    const svg = buildSvg({
      login: user.login,
      stars,
      commits: user.contributionsCollection.totalCommitContributions,
      prs: user.contributionsCollection.totalPullRequestContributions,
      repos: user.repositories.totalCount,
      followers: user.followers.totalCount,
      topLangs,
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).send(svg);
  } catch (err) {
    res.status(500).send("Erro gerando o SVG: " + err.message);
  }
}
