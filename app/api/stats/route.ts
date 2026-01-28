import { NextRequest, NextResponse } from 'next/server';
import { getTeamStats } from '@/lib/gameState';

export async function GET() {
  const stats = getTeamStats();
  return NextResponse.json(stats);
}
