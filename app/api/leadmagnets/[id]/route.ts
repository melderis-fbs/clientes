import { NextRequest, NextResponse } from 'next/server';
import { updateLeadMagnetInNotion } from '@/lib/notion';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateLeadMagnetInNotion(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating lead magnet:', error);
    return NextResponse.json(
      { error: 'Failed to update lead magnet' },
      { status: 500 }
    );
  }
}
