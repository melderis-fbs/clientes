# Biblioteca de Clientes

App Next.js conectada a la base de datos **Biblioteca Clientes** en Notion.

## Setup

1. Copiá el archivo de entorno:
   ```bash
   cp .env.local.example .env.local
   ```

2. Completá las variables en `.env.local`:
   - `NOTION_API_KEY` — token de integración de Notion
   - `NOTION_DATABASE_ID` — ID de la base de datos (ya está precargado)

3. Instalá dependencias y levantá:
   ```bash
   npm install
   npm run dev
   ```

## Schema de Notion

| Campo | Tipo |
|-------|------|
| Nombre | title |
| Email | email |
| Nicho | select |
| Profesión | text |
| Negocio | text |
| A quién ayuda | text |
| Instagram | url |
| Testimonio | url |
| Caso de éxito | checkbox |
