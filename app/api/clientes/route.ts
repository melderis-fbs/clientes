import { NextResponse } from 'next/server';
import { fetchClientes, createClienteInNotion } from '@/lib/notion';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }
    const id = await createClienteInNotion(body);
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error('Error creating cliente:', error);
    return NextResponse.json(
      { error: 'No se pudo crear el cliente', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clientes = await fetchClientes();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clientes', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
