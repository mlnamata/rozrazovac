import { NextRequest, NextResponse } from 'next/server';
import {
  getGameState,
  setTeams,
  startRound,
  endRound,
  resetGame,
  TeamImage,
} from '@/lib/gameState';

export async function GET() {
  const state = getGameState();
  return NextResponse.json({
    status: state.status,
    teams: state.teams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, teams } = body;

  if (action === 'setTeams') {
    const teamImages: TeamImage[] = teams.map(
      (url: string, index: number) => ({
        id: String(index),
        url,
        label: String.fromCharCode(65 + index), // A, B, C, D, E...
      })
    );
    setTeams(teamImages);
    return NextResponse.json({ success: true });
  }

  if (action === 'startRound') {
    startRound();
    return NextResponse.json({ success: true });
  }

  if (action === 'endRound') {
    endRound();
    return NextResponse.json({ success: true });
  }

  if (action === 'resetGame') {
    resetGame();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: 'Unknown action' },
    { status: 400 }
  );
}
