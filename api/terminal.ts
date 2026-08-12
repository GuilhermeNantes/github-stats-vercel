import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="680"
  height="850"
  viewBox="0 0 680 850"
>
  <rect
    width="680"
    height="850"
    rx="14"
    fill="#0B0B0B"
  />

  <rect
    x="0.5"
    y="0.5"
    width="679"
    height="849"
    rx="14"
    fill="none"
    stroke="#2a2a2a"
  />

  <!-- Window buttons -->

  <circle
    cx="38"
    cy="36"
    r="5"
    fill="#444"
  />

  <circle
    cx="54"
    cy="36"
    r="5"
    fill="#444"
  />

  <circle
    cx="70"
    cy="36"
    r="5"
    fill="#444"
  />

  <!-- whoami -->

  <text
    x="28"
    y="75"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ whoami
  </text>

  <text
    x="28"
    y="99"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="16"
    font-weight="600"
  >
    guilherme-nantes — software developer
  </text>

  <!-- manifesto -->

  <text
    x="28"
    y="135"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ cat manifesto.txt
  </text>

  <text
    x="28"
    y="160"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="13"
  >
    simple over clever. maintainable over fast.
  </text>

  <text
    x="28"
    y="181"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="13"
  >
    tools that disappear into the workflow.
  </text>

  <!-- git -->

  <text
    x="28"
    y="220"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ git log --oneline --author=me
  </text>

  <text
    x="28"
    y="248"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="13"
  >
    v3.2
  </text>

  <text
    x="68"
    y="248"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="13"
  >
    exploring backend architecture
  </text>

  <text
    x="28"
    y="274"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="13"
  >
    v3.1
  </text>

  <text
    x="68"
    y="274"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="13"
  >
    shipped gestur — institutional systems
  </text>

  <text
    x="28"
    y="300"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="13"
  >
    v3.0
  </text>

  <text
    x="68"
    y="300"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="13"
  >
    started forge — dev automation
  </text>

  <!-- projects -->

  <text
    x="28"
    y="340"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ ls ./projects
  </text>

  <rect
    x="28"
    y="360"
    width="130"
    height="38"
    rx="6"
    fill="none"
    stroke="#333"
  />

  <text
    x="42"
    y="384"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="12"
  >
    forge
  </text>

  <text
    x="82"
    y="384"
    fill="#666"
    font-family="Courier New, monospace"
    font-size="12"
  >
    · go
  </text>

  <rect
    x="170"
    y="360"
    width="140"
    height="38"
    rx="6"
    fill="none"
    stroke="#333"
  />

  <text
    x="184"
    y="384"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="12"
  >
    gestur
  </text>

  <text
    x="234"
    y="384"
    fill="#666"
    font-family="Courier New, monospace"
    font-size="12"
  >
    · next.js
  </text>

  <rect
    x="322"
    y="360"
    width="220"
    height="38"
    rx="6"
    fill="none"
    stroke="#333"
  />

  <text
    x="336"
    y="384"
    fill="#ccc"
    font-family="Courier New, monospace"
    font-size="12"
  >
    inferno-de-dantes
  </text>

  <text
    x="470"
    y="384"
    fill="#666"
    font-family="Courier New, monospace"
    font-size="12"
  >
    · react
  </text>

  <!-- stats -->

  <text
    x="28"
    y="430"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ ./stats --show
  </text>

  <!-- stats card -->

  <rect
    x="28"
    y="450"
    width="300"
    height="155"
    rx="8"
    fill="#111"
    stroke="#222"
  />

  <text
    x="44"
    y="478"
    fill="#B11226"
    font-family="Segoe UI, sans-serif"
    font-size="12"
    font-weight="600"
  >
    GitHub stats
  </text>

  <text
    x="44"
    y="510"
    fill="#999"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    Commits
  </text>

  <text
    x="280"
    y="510"
    fill="#ccc"
    text-anchor="end"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    1,204
  </text>

  <text
    x="44"
    y="540"
    fill="#999"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    Stars
  </text>

  <text
    x="280"
    y="540"
    fill="#ccc"
    text-anchor="end"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    128
  </text>

  <text
    x="44"
    y="570"
    fill="#999"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    PRs
  </text>

  <text
    x="280"
    y="570"
    fill="#ccc"
    text-anchor="end"
    font-family="Segoe UI, sans-serif"
    font-size="11"
  >
    67
  </text>

  <!-- languages -->

  <rect
    x="342"
    y="450"
    width="310"
    height="155"
    rx="8"
    fill="#111"
    stroke="#222"
  />

  <text
    x="358"
    y="478"
    fill="#B11226"
    font-family="Segoe UI, sans-serif"
    font-size="12"
    font-weight="600"
  >
    Top languages
  </text>

  <rect
    x="358"
    y="495"
    width="278"
    height="6"
    rx="4"
    fill="#222"
  />

  <rect
    x="358"
    y="495"
    width="106"
    height="6"
    rx="4"
    fill="#B11226"
  />

  <text
    x="358"
    y="522"
    fill="#999"
    font-family="Segoe UI, sans-serif"
    font-size="10"
  >
    TypeScript 38%
  </text>

  <rect
    x="358"
    y="540"
    width="278"
    height="6"
    rx="4"
    fill="#222"
  />

  <rect
    x="358"
    y="540"
    width="75"
    height="6"
    rx="4"
    fill="#8a1a1a"
  />

  <text
    x="358"
    y="567"
    fill="#999"
    font-family="Segoe UI, sans-serif"
    font-size="10"
  >
    Go 27%
  </text>

  <!-- contact -->

  <text
    x="28"
    y="650"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ cat contact.txt
  </text>

  <text
    x="28"
    y="678"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="12"
  >
    github.com/GuilhermeNantes
  </text>

  <text
    x="220"
    y="678"
    fill="#666"
    font-family="Courier New, monospace"
    font-size="12"
  >
    ·
  </text>

  <text
    x="240"
    y="678"
    fill="#B11226"
    font-family="Courier New, monospace"
    font-size="12"
  >
    linkedin
  </text>

  <!-- cursor -->

  <text
    x="28"
    y="720"
    fill="#888"
    font-family="Courier New, monospace"
    font-size="13"
  >
    $ _
  </text>

</svg>
`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  res.status(200).send(svg);
}
