// In-memory state management for the game

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
  gameState.teams = images;
  gameState.usersByTeam.clear();
  images.forEach((img) => {
    gameState.usersByTeam.set(img.id, []);
  });
}

export function startRound(): void {
  gameState.status = 'ACTIVE';
  gameState.users.clear();
  gameState.usersByTeam.forEach((users) => {
    users.length = 0;
  });
}

export function endRound(): void {
  gameState.status = 'ENDED';
}

export function resetGame(): void {
  gameState.status = 'SETUP';
  gameState.teams = [];
  gameState.users.clear();
  gameState.usersByTeam.clear();
}

export function assignUserToTeam(userId: string): string | null {
  // Find team with least members
  if (gameState.teams.length === 0) return null;

  let minTeamId = gameState.teams[0].id;
  let minCount = gameState.usersByTeam.get(minTeamId)?.length ?? 0;

  for (const team of gameState.teams) {
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
  gameState.usersByTeam.get(minTeamId)?.push(userId);

  return minTeamId;
}

export function getTeamStats(): Array<{
  id: string;
  label: string;
  url: string;
  count: number;
}> {
  return gameState.teams.map((team) => ({
    id: team.id,
    label: team.label,
    url: team.url,
    count: gameState.usersByTeam.get(team.id)?.length ?? 0,
  }));
}

export function getUserTeamId(userId: string): string | null {
  return gameState.users.get(userId)?.teamId ?? null;
}

export function getTotalUsers(): number {
  return gameState.users.size;
}
