export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  const clientesDbId = process.env.NOTION_CLIENTES_DB_ID;
  const leadmagnetsDbId = process.env.NOTION_LEADMAGNETS_DB_ID;

  const result: Record<string, unknown> = {
    token: token ? `${token.slice(0, 10)}...` : 'NOT SET',
    clientesDbId: clientesDbId || 'NOT SET',
    leadmagnetsDbId: leadmagnetsDbId || 'NOT SET',
  };

  if (!token) return NextResponse.json(result);

  const notion = new Client({ auth: token });

  try {
    const db = await notion.databases.retrieve({ database_id: clientesDbId! });
    result.clientesDb = 'OK';
    result.clientesProps = Object.keys((db as any).properties);
  } catch (e: unknown) {
    result.clientesDb = 'ERROR';
    result.clientesError = e instanceof Error ? e.message : String(e);
  }

  try {
    const db = await notion.databases.retrieve({ database_id: leadmagnetsDbId! });
    result.leadmagnetsDb = 'OK';
    result.leadmagnetsProps = Object.keys((db as any).properties);
  } catch (e: unknown) {
    result.leadmagnetsDb = 'ERROR';
    result.leadmagnetsError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(result);
}
