# github-stats-vercel

Gerador de card SVG estilo terminal com seus dados reais do GitHub, hospedado no Vercel.

## 1. Criar um GitHub Token

1. Vá em https://github.com/settings/tokens → **Generate new token (classic)**
2. Marque o escopo `read:user` (e `public_repo` se quiser ler dados de repos privados também, mas não é obrigatório)
3. Copie o token gerado (só aparece uma vez)

## 2. Subir este projeto pro GitHub

Crie um repositório novo (ex: `github-stats-vercel`) e suba esses arquivos:

```
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/github-stats-vercel.git
git push -u origin main
```

## 3. Importar no Vercel

1. Vá em https://vercel.com/new
2. Selecione o repositório `github-stats-vercel`
3. Antes de fazer deploy, clique em **Environment Variables** e adicione:
   - Nome: `GITHUB_TOKEN`
   - Valor: o token que você copiou no passo 1
4. Clique em **Deploy**

## 4. Usar no seu README de perfil

Depois do deploy, o Vercel te dá uma URL tipo `https://github-stats-vercel.vercel.app`.

No seu `README.md` de perfil, use:

```markdown
<img src="https://github-stats-vercel.vercel.app/api/stats?username=SEU_USUARIO" width="100%" alt="stats" />
```

Toda vez que alguém visitar seu perfil, a imagem é gerada na hora com seus dados atualizados.

## Customizar cores/layout

Edite `api/stats.js` — as cores estão nas classes CSS dentro do `<style>` (variável `buildSvg`).
