// In-memory state management for the game
// Note: This resets on server restart. For production, use a database.

export interface TeamImage {
  id: string;
  url: string;
  label: string;
}

export interface User {
  userId: string;
  teamId: string | null;
  joinedAt: number;
}

export interface GameState {
  status: 'SETUP' | 'ACTIVE' | 'ENDED';
  teams: TeamImage[];
  users: Map<string, User>;
  usersByTeam: Map<string, string[]>; // teamId -> userIds
}

let gameState: GameState = {
  status: 'SETUP',
  teams: [],
  users: new Map(),
  usersByTeam: new Map(),
};

export function getGameState(): GameState {
  return gameState;
}

export function setTeams(images: TeamImage[]): void {
  try {
    gameState.teams = images || [];
    gameState.usersByTeam.clear();
    gameState.teams.forEach((img) => {
      if (img && img.id) {
        gameState.usersByTeam.set(img.id, []);
      }
    });
  } catch (err) {
    console.error('Error setting teams:', err);
  }
}

export function startRound(): void {
  try {
    gameState.status = 'ACTIVE';
    gameState.users.clear();
    gameState.usersByTeam.forEach((users) => {
      users.length = 0;
    });
  } catch (err) {
    console.error('Error starting round:', err);
  }
}

export function endRound(): void {
  try {
    gameState.status = 'ENDED';
  } catch (err) {
    console.error('Error ending round:', err);
  }
}

export function resetGame(): void {
  try {
    gameState.status = 'SETUP';
    gameState.teams = [];
    gameState.users.clear();
    gameState.usersByTeam.clear();
  } catch (err) {
    console.error('Error resetting game:', err);
  }
}

export function assignUserToTeam(userId: string): string | null {
  try {
    // Find team with least members
    if (!gameState.teams || gameState.teams.length === 0) return null;

    let minTeamId = gameState.teams[0]?.id;
    if (!minTeamId) return null;

    let minCount = gameState.usersByTeam.get(minTeamId)?.length ?? 0;

    for (const team of gameState.teams) {
      if (!team || !team.id) continue;
      const count = gameState.usersByTeam.get(team.id)?.length ?? 0;
      if (count < minCount) {
        minCount = count;
        minTeamId = team.id;
      }
    }

    // Check if user already assigned
    if (gameState.users.has(userId)) {
      return gameState.users.get(userId)!.teamId;
    }

    // Assign user to team
    const user: User = {
      userId,
      teamId: minTeamId,
      joinedAt: Date.now(),
    };

    gameState.users.set(userId, user);
    const teamUsers = gameState.usersByTeam.get(minTeamId);
    if (teamUsers) {
      teamUsers.push(userId);
    }

    return minTeamId;
  } catch (err) {
    console.error('Error assigning user to team:', err);
    return null;
  }
}

export function getTeamStats(): Array<{
  id: string;
  label: string;
  url: string;
  count: number;
}> {
  try {
    return (gameState.teams || []).map((team) => ({
      id: team.id,
      label: team.label,
      url: team.url,
      count: gameState.usersByTeam.get(team.id)?.length ?? 0,
    }));
  } catch (err) {
    console.error('Error getting team stats:', err);
    return [];
  }
}

export function getUserTeamId(userId: string): string | null {
  try {
    return gameState.users.get(userId)?.teamId ?? null;
  } catch (err) {
    console.error('Error getting user team ID:', err);
    return null;
  }
}

export function getTotalUsers(): number {
  try {
    return gameState.users.size;
  } catch (err) {
    console.error('Error getting total users:', err);
    return 0;
  }
}
