import { Client } from '@notionhq/client';
import type { Cliente, LeadMagnet } from './types';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// ---------------------------------------------------------------------------
// Helper: safely extract plain text from a Notion rich_text array
// ---------------------------------------------------------------------------
function richText(arr: { plain_text: string }[] | undefined): string {
  if (!arr || arr.length === 0) return '';
  return arr[0].plain_text ?? '';
}

// ---------------------------------------------------------------------------
// fetchClientes
// ---------------------------------------------------------------------------
export async function fetchClientes(): Promise<Cliente[]> {
  const dbId = process.env.NOTION_CLIENTES_DB_ID;
  if (!dbId) throw new Error('NOTION_CLIENTES_DB_ID is not set');

  const allResults: any[] = [];
  let cursor: string | undefined;

  do {
    const page = await notion.databases.query({
      database_id: dbId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    allResults.push(...page.results);
    cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return allResults.map((page) => {
    const props = (page as any).properties as Record<string, any>;

    const nombre =
      richText(props['Nombre']?.title) ||
      richText(props['nombre']?.title) ||
      '';

    const instagram =
      props['Instagram']?.url ??
      props['instagram']?.url ??
      '';

    const nicho =
      props['Nicho']?.select?.name ??
      props['nicho']?.select?.name ??
      '';

    const profesion =
      richText(props['Profesión']?.rich_text) ||
      richText(props['Profesion']?.rich_text) ||
      '';

    const negocio =
      richText(props['Negocio']?.rich_text) ||
      richText(props['negocio']?.rich_text) ||
      '';

    const nombreNegocio =
      richText(props['negocio(nombre)']?.rich_text) ||
      richText(props['Negocio(nombre)']?.rich_text) ||
      '';

    const aQuienAyuda =
      richText(props['A quién ayuda']?.rich_text) ||
      richText(props['A quien ayuda']?.rich_text) ||
      '';

    const noFue =
      props['NO']?.checkbox ??
      props['no']?.checkbox ??
      false;

    const testimonio =
      props['Testimonio']?.url ??
      props['testimonio']?.url ??
      richText(props['Testimonio']?.rich_text) ??
      '';

    const estado =
      props['Estado']?.select?.name ??
      props['estado']?.select?.name ??
      '';

    const email =
      props['Email']?.email ??
      props['email']?.email ??
      '';

    return {
      id: page.id,
      nombre,
      instagram,
      nicho,
      profesion,
      negocio,
      aQuienAyuda,
      noFue,
      nombreNegocio,
      testimonio,
      estado,
      email,
    } satisfies Cliente;
  });
}

// ---------------------------------------------------------------------------
// fetchLeadMagnets
// ---------------------------------------------------------------------------
export async function fetchLeadMagnets(): Promise<LeadMagnet[]> {
  const dbId = process.env.NOTION_LEADMAGNETS_DB_ID;
  if (!dbId) throw new Error('NOTION_LEADMAGNETS_DB_ID is not set');

  const allResults: any[] = [];
  let cursor: string | undefined;

  do {
    const page = await notion.databases.query({
      database_id: dbId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    allResults.push(...page.results);
    cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return allResults.map((page) => {
    const props = (page as any).properties as Record<string, any>;

    const palabraClave =
      richText(props['Palabra Clave']?.title) ||
      richText(props['Palabra clave']?.title) ||
      richText(props['palabraClave']?.title) ||
      '';

    const tema =
      props['Tema']?.select?.name ??
      richText(props['Tema']?.rich_text) ??
      '';

    const descripcion =
      richText(props['Descripción']?.rich_text) ||
      richText(props['Descripcion']?.rich_text) ||
      '';

    const link =
      props['Link']?.url ??
      props['link']?.url ??
      '';

    const cuandoEnviar =
      richText(props['Cuando enviar']?.rich_text) ||
      richText(props['Cuándo enviar']?.rich_text) ||
      '';

    const dirigidoA =
      richText(props['Dirigido a']?.rich_text) ||
      richText(props['dirigidoA']?.rich_text) ||
      '';

    // NOTE: If a "Tipo" select column is added to the Notion database later,
    // prefer it here: props['Tipo']?.select?.name as 'Video' | 'Entregable'
    // For now, infer from the link URL.
    const isVideo =
      !!link &&
      (link.includes('youtube.com') ||
        link.includes('youtu.be') ||
        link.includes('vimeo.com') ||
        link.includes('loom.com'));

    const tipo: 'Video' | 'Entregable' = isVideo ? 'Video' : 'Entregable';

    return {
      id: page.id,
      palabraClave,
      tema,
      descripcion,
      link,
      cuandoEnviar,
      dirigidoA,
      tipo,
    } satisfies LeadMagnet;
  });
}

// ---------------------------------------------------------------------------
// updateClienteInNotion
// ---------------------------------------------------------------------------
export async function updateClienteInNotion(
  id: string,
  fields: Partial<{
    instagram: string;
    negocio: string;
    testimonio: string;
    profesion: string;
    aQuienAyuda: string;
    email: string;
    estado: string;
    nicho: string;
  }>
): Promise<void> {
  const properties: Record<string, any> = {};

  if (fields.nicho !== undefined) {
    properties['Nicho'] = { select: fields.nicho ? { name: fields.nicho } : null };
  }
  if (fields.estado !== undefined) {
    properties['Estado'] = { select: fields.estado ? { name: fields.estado } : null };
  }
  if (fields.instagram !== undefined) {
    properties['Instagram'] = { url: fields.instagram || null };
  }
  if (fields.negocio !== undefined) {
    properties['Negocio'] = {
      rich_text: [{ text: { content: fields.negocio } }],
    };
  }
  if (fields.testimonio !== undefined) {
    properties['Testimonio'] = { url: fields.testimonio || null };
  }
  if (fields.profesion !== undefined) {
    properties['Profesión'] = {
      rich_text: [{ text: { content: fields.profesion } }],
    };
  }
  if (fields.aQuienAyuda !== undefined) {
    properties['A quién ayuda'] = {
      rich_text: [{ text: { content: fields.aQuienAyuda } }],
    };
  }
  if (fields.email !== undefined) {
    properties['Email'] = { email: fields.email || null };
  }

  await notion.pages.update({ page_id: id, properties });
}

// ---------------------------------------------------------------------------
// updateLeadMagnetInNotion
// ---------------------------------------------------------------------------
export async function updateLeadMagnetInNotion(
  id: string,
  fields: Partial<{
    link: string;
    descripcion: string;
    cuandoEnviar: string;
    dirigidoA: string;
    tema: string;
  }>
): Promise<void> {
  const properties: Record<string, any> = {};

  if (fields.link !== undefined) {
    properties['Link'] = { url: fields.link || null };
  }
  if (fields.descripcion !== undefined) {
    properties['Descripción'] = {
      rich_text: [{ text: { content: fields.descripcion } }],
    };
  }
  if (fields.cuandoEnviar !== undefined) {
    properties['Cuándo enviar'] = {
      rich_text: [{ text: { content: fields.cuandoEnviar } }],
    };
  }
  if (fields.dirigidoA !== undefined) {
    properties['Dirigido a'] = {
      rich_text: [{ text: { content: fields.dirigidoA } }],
    };
  }
  if (fields.tema !== undefined) {
    // Tema can be a select or rich_text — try rich_text for compatibility
    properties['Tema'] = {
      rich_text: [{ text: { content: fields.tema } }],
    };
  }

  await notion.pages.update({ page_id: id, properties });
}

// ---------------------------------------------------------------------------
// createClienteInNotion
// ---------------------------------------------------------------------------
export async function createClienteInNotion(fields: {
  nombre: string;
  instagram?: string;
  nicho?: string;
  profesion?: string;
  negocio?: string;
  aQuienAyuda?: string;
  email?: string;
  estado?: string;
}): Promise<string> {
  const dbId = process.env.NOTION_CLIENTES_DB_ID;
  if (!dbId) throw new Error('NOTION_CLIENTES_DB_ID is not set');

  const properties: Record<string, any> = {
    Nombre: { title: [{ text: { content: fields.nombre } }] },
  };
  if (fields.instagram) properties['Instagram'] = { url: fields.instagram };
  if (fields.nicho) properties['Nicho'] = { select: { name: fields.nicho } };
  if (fields.profesion) properties['Profesión'] = { rich_text: [{ text: { content: fields.profesion } }] };
  if (fields.negocio) properties['Negocio'] = { rich_text: [{ text: { content: fields.negocio } }] };
  if (fields.aQuienAyuda) properties['A quién ayuda'] = { rich_text: [{ text: { content: fields.aQuienAyuda } }] };
  if (fields.email) properties['Email'] = { email: fields.email };
  if (fields.estado) properties['Estado'] = { select: { name: fields.estado } };

  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties,
  });

  return page.id;
}
