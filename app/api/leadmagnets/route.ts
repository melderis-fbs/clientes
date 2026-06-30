import { NextResponse } from 'next/server';
import { fetchLeadMagnets } from '@/lib/notion';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leadMagnets = await fetchLeadMagnets();
    return NextResponse.json(leadMagnets);
  } catch (error) {
    console.error('Error fetching lead magnets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead magnets' },
      { status: 500 }
    );
  }
}
