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
  try {
    const state = getGameState();
    return NextResponse.json({
      status: state.status,
      teams: state.teams || [],
    });
  } catch (err) {
    console.error('GET /api/game error:', err);
    return NextResponse.json(
      { error: 'Failed to get game state' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, teams } = body;

    if (action === 'setTeams') {
      if (!teams || !Array.isArray(teams)) {
        return NextResponse.json(
          { error: 'Teams must be an array' },
          { status: 400 }
        );
      }
      const teamImages: TeamImage[] = teams
        .filter((url) => typeof url === 'string' && url.trim())
        .map((url: string, index: number) => ({
          id: String(index),
          url,
          label: String.fromCharCode(65 + index), // A, B, C, D, E...
        }));
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
  } catch (err) {
    console.error('POST /api/game error:', err);
    return NextResponse.json(
      { error: 'Failed to process game action' },
      { status: 500 }
    );
  }
}
