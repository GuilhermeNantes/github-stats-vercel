# github-stats-vercel

Gerador de card SVG estilo terminal macOS com dados reais do GitHub, hospedado
no Vercel. Suporta temas, animação de typing nos textos, animação matrix nos
números e várias formas de visualização.

<p align="center">
  <a href="https://github-stats-vercel.vercel.app/api/terminal?username=GuilhermeNantes&cmd=whoami,manifest,gitlog,stats,languages,projects,contact&noanimation=true&theme=github">
    <img src="https://github-stats-vercel.vercel.app/api/terminal?username=GuilhermeNantes&cmd=whoami,manifest,gitlog,stats,languages,projects,contact&noanimation=true&theme=github" alt="github stats terminal" />
  </a>
</p>

## Setup

### 1. Criar token do GitHub

1. Vá em https://github.com/settings/tokens
2. **Generate new token (classic)**
3. Escopos: `public_repo` + `read:user`
4. Copie o token (começa com `ghp_...`)

### 2. Rodar localmente

```bash
npm install
# Crie .env.local com seu token
echo "GITHUB_TOKEN=ghp_seu_token_aqui" > .env.local
npx tsx dev-server.cjs
```

Acesse `http://localhost:3000/api/terminal?username=SEU_USER`

### 3. Deploy no Vercel

1. Suba o projeto para o GitHub
2. Importe no [Vercel](https://vercel.com/new)
3. **Settings → Environment Variables**:
   - Nome: `GITHUB_TOKEN`
   - Valor: `ghp_seu_token`
4. Deploy

## Uso

### URL básica

```
/api/terminal?username=SEU_USER
```

### Parâmetros

| Param | Default | Descrição |
|---|---|---|
| `username` | (obrigatório) | Login do GitHub |
| `cmd` | `whoami,manifest,stats,languages,projects,contact` | Comandos separados por vírgula |
| `theme` | `dark` | `dark`, `github`, `cupertino`, `dracula`, `white`, `cappuccino` |
| `speed` | `normal` | `slow`, `normal`, `fast`, `instant` |
| `noanimation` | `false` | Desliga todas animações |
| `hide` | (vazio) | Comandos a esconder |
| `width` | `680` | Largura do SVG |
| `height` | dinâmico | Altura do SVG (auto-ajusta ao conteúdo) |
| `name` | `Guilherme Nantes` | Nome completo (whoami) |
| `role` | `Software Developer` | Cargo / título |
| `motto` | `simple over clever.` | Frase de destaque no manifesto |
| `mock` | `false` | Usa dados mockados (sem chamar API) |
| `help` | `false` | Mostra tela de ajuda |

### Comandos disponíveis

| Comando | O que mostra | Link |
|---|---|---|
| `whoami` | Login + role em destaque | github.com/[user] |
| `manifest` | Manifesto + motto + style + stack + rule | — |
| `gitlog` | Últimos 5 commits públicos (sha + msg + data) | — |
| `stats` | Repos/stars/forks/followers/following + top repo + idade | — |
| `languages` | Top linguagens com barras `█░` | — |
| `projects` | Top 4 repos em pills clicáveis | github.com/[user]/[repo] |
| `contributions` | Heatmap 12 semanas + totais | — |
| `contact` | github + linkedin | github.com/[user] |

## Temas

| Nome | Background | Accent | Uso |
|---|---|---|---|
| `dark` / `github` | `#0B0B0B` | `#B11226` | Padrão, terminal dark |
| `dracula` | `#282A36` | `#FF79C6` | Dracula theme |
| `cupertino` | `#FFFFFF` | `#007AFF` | macOS light |
| `white` | `#FFFFFF` | `#D1242F` | GitHub style light |
| `cappuccino` | `#2C232A` | `#C9A87C` | Coffee vibes |

## Exemplo para README de perfil

```html
<p align="center">
  <a href="https://github.com/GuilhermeNantes">
    <img src="https://github-stats-vercel.vercel.app/api/terminal?username=GuilhermeNantes&cmd=whoami,manifest,gitlog,stats,languages,projects,contact&noanimation=true&theme=github" width="680" alt="GitHub Stats" />
  </a>
</p>
```

### Variações

```markdown
<!-- Completo, sem animação -->
https://github-stats-vercel.vercel.app/api/terminal?username=SEU_USER&noanimation=true

<!-- Só stats -->
https://github-stats-vercel.vercel.app/api/terminal?username=SEU_USER&cmd=stats

<!-- Tema Dracula -->
https://github-stats-vercel.vercel.app/api/terminal?username=SEU_USER&theme=dracula

<!-- Modo help -->
https://github-stats-vercel.vercel.app/api/terminal?help=1
```

## Animações

Todas as animações são feitas com SMIL (`<animate>`) — funcionam mesmo quando o
SVG é carregado via `<img>` no README do GitHub (sem JavaScript).

- **Typing**: texto aparece caractere por caractere
- **Matrix**: números fazem 2-3 ciclos "aleatórios" antes do valor real
- **Cursor**: pisca infinito (`▌`)
- **Fade-in**: blocos aparecem em sequência
- **Bars**: barras crescem da esquerda para a direita
- **Heatmap**: cada célula aparece com delay

Desligue tudo com `&noanimation=true` ou `&speed=instant`.

## Troubleshooting

### "GitHub API rate limit exceeded"

Você não configurou o `GITHUB_TOKEN`. Sem token: 60 req/h. Com token: 5000 req/h.

### "User not found"

- Verifique se o username está correto (case-sensitive)
- Confirme que a conta existe em https://github.com/SEU_USER

### SVG em branco / não renderiza

- Abra o SVG direto no navegador (não só `<img>`)
- Verifique se algum comando tem erro de digitação (use `?help=1`)

### Token exposto

O token **nunca** aparece no SVG ou em logs públicos. Fica só na env do servidor.

## Arquitetura

```
api/terminal.ts          ← Handler Vercel
src/
├── commands/            ← Um arquivo por comando (whoami, stats, etc)
├── config/              ← Parser de query string + defaults
├── github/              ← Client GraphQL/REST + mock
├── render/              ← Renderizadores SVG (barras, anéis, heatmap, etc)
├── themes/              ← Temas (cores por nome)
└── types/               ← TypeScript types
```

Cada command é uma função `(context) => CommandResult`. Cada renderer recebe
`CommandResult` e devolve SVG. Tudo é composável.
