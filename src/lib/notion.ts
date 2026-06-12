import { Client } from "@notionhq/client";
import type {
  QueryDataSourceResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Cliente } from "@/types/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;

function prop(page: PageObjectResponse, name: string) {
  return page.properties[name];
}

function extractText(p: PageObjectResponse["properties"][string]): string | null {
  if (p.type === "rich_text") return p.rich_text[0]?.plain_text ?? null;
  if (p.type === "title") return p.title[0]?.plain_text ?? null;
  return null;
}

function extractEmail(p: PageObjectResponse["properties"][string]): string | null {
  return p.type === "email" ? p.email : null;
}

function extractUrl(p: PageObjectResponse["properties"][string]): string | null {
  return p.type === "url" ? p.url : null;
}

function extractSelect(p: PageObjectResponse["properties"][string]): string | null {
  return p.type === "select" ? (p.select?.name ?? null) : null;
}

function extractCheckbox(p: PageObjectResponse["properties"][string]): boolean {
  return p.type === "checkbox" ? p.checkbox : false;
}

export async function getClientes(): Promise<Cliente[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response: QueryDataSourceResponse = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      sorts: [{ property: "Nombre", direction: "ascending" }],
      start_cursor: cursor,
    });

    for (const result of response.results) {
      if (result.object === "page" && "properties" in result) {
        pages.push(result as PageObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages.map((page) => ({
    id: page.id,
    nombre: extractText(prop(page, "Nombre")) ?? "Sin nombre",
    email: extractEmail(prop(page, "Email")),
    nicho: extractSelect(prop(page, "Nicho")) as Cliente["nicho"],
    profesion: extractText(prop(page, "Profesión")),
    negocio: extractText(prop(page, "Negocio")),
    aQuienAyuda: extractText(prop(page, "A quién ayuda")),
    instagram: extractUrl(prop(page, "Instagram")),
    testimonio: extractUrl(prop(page, "Testimonio")),
    casoDeExito: extractCheckbox(prop(page, "Caso de éxito")),
  }));
}
