import { NextResponse } from 'next/server';
import { fetchClientes } from '@/lib/notion';

export const revalidate = 60;

export async function GET() {
  try {
    const clientes = await fetchClientes();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clientes' },
      { status: 500 }
    );
  }
}
