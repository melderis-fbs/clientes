import { NextRequest, NextResponse } from 'next/server';
import { updateClienteInNotion } from '@/lib/notion';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateClienteInNotion(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating cliente:', error);
    return NextResponse.json(
      { error: 'Failed to update cliente' },
      { status: 500 }
    );
  }
}
