# Biblioteca Comercial — Founders BS

Internal web app for the sales team. Two tabs: **Clientes** and **Lead Magnets**, plus an AI assistant to suggest resources for specific leads.

## Setup

### 1. Create a Notion Internal Integration

1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Click **+ New integration**
3. Name it "Biblioteca Comercial", select your workspace
4. Copy the **Internal Integration Token** — this is your `NOTION_TOKEN`

### 2. Share your Notion databases with the integration

- Open each database (Clientes and Lead Magnets) in Notion
- Click the **•••** menu (top right) → **Add connections** → select your integration

### 3. Get the database IDs

For each database:
1. Open the database in Notion (full page view)
2. Click **•••** → **Copy link**
3. The URL looks like: `https://www.notion.so/yourworkspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...`
4. The UUID between the last `/` and `?` is your database ID (32 hex chars, optionally with dashes)

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CLIENTES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_LEADMAGNETS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push this folder to a GitHub repository
2. Import the repo in [Vercel](https://vercel.com)
3. Add the four environment variables in **Settings → Environment Variables**
4. Deploy

## Notion database schemas

### Clientes database

| Property name | Notion type |
|---|---|
| Nombre | Title |
| Instagram | URL |
| Nicho | Select |
| Profesión | Rich text |
| Negocio | Rich text |
| A quién ayuda | Rich text |
| Caso de éxito | Checkbox |
| Testimonio | URL |
| Email | Email |

### Lead Magnets database

| Property name | Notion type |
|---|---|
| Palabra Clave | Title |
| Tema | Select or Rich text |
| Descripción | Rich text |
| Link | URL |
| Cuándo enviar | Rich text |
| Dirigido a | Rich text |

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Notion API** (`@notionhq/client`)
- **Anthropic API** (`@anthropic-ai/sdk`) for the AI assistant
