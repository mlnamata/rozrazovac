import { NextRequest, NextResponse } from 'next/server';
import {
  getGameState,
  assignUserToTeam,
  getTeamStats,
  getUserTeamId,
} from '@/lib/gameState';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const state = getGameState();

  if (state.status === 'SETUP' || state.status === 'ENDED') {
    return NextResponse.json({
      status: state.status,
      teamId: null,
      teamLabel: null,
      teamUrl: null,
      teamStats: getTeamStats(),
    });
  }

  // ACTIVE status - assign user to team
  let teamId = getUserTeamId(userId);
  if (!teamId) {
    teamId = assignUserToTeam(userId);
  }

  const team = state.teams.find((t) => t.id === teamId);
  const teamStats = getTeamStats();

  return NextResponse.json({
    status: state.status,
    teamId,
    teamLabel: team?.label ?? null,
    teamUrl: team?.url ?? null,
    teamStats,
  });
}
