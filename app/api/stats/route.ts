import { NextRequest, NextResponse } from 'next/server';
import { getTeamStats } from '@/lib/gameState';

export async function GET() {
  try {
    const stats = getTeamStats();
    return NextResponse.json(stats || []);
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
