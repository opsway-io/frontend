export const OPSWAY_API_URL =
  process.env.NEXT_PUBLIC_OPSWAY_API_URL || "https://api.opsway.eu";

export interface OpswayTeamSummary {
  id: number;
  name: string;
  displayName?: string;
  role?: string;
}

export interface OpswaySessionResult {
  authenticated: boolean;
  userId: number | null;
  teamId: number | null;
  team: OpswayTeamSummary | null;
  error: string | null;
}

/**
 * Resolves the authenticated Opsway user and active team using the shared
 * opsway.eu session cookies, retrying once via /v1/auth/refresh on 401.
 */
export async function resolveOpswaySession(): Promise<OpswaySessionResult> {
  let meRes = await fetch(`${OPSWAY_API_URL}/v1/auth/me`, {
    credentials: "include",
  });
  if (meRes.status === 401) {
    const refreshRes = await fetch(`${OPSWAY_API_URL}/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      meRes = await fetch(`${OPSWAY_API_URL}/v1/auth/me`, {
        credentials: "include",
      });
    }
  }
  if (meRes.status === 401) {
    return {
      authenticated: false,
      userId: null,
      teamId: null,
      team: null,
      error: "Sign in to your Opsway account to view team and billing details.",
    };
  }
  if (!meRes.ok) {
    throw new Error(`Failed to resolve Opsway user (${meRes.status})`);
  }
  const meData = await meRes.json();
  const userId: number | undefined = meData?.user?.id ?? meData?.id;
  if (!userId) {
    throw new Error("Could not determine authenticated Opsway user.");
  }

  const teamsRes = await fetch(`${OPSWAY_API_URL}/v1/users/${userId}/teams`, {
    credentials: "include",
  });
  if (!teamsRes.ok) {
    throw new Error(`Failed to resolve Opsway team (${teamsRes.status})`);
  }
  const teamsData = await teamsRes.json();
  const team: OpswayTeamSummary | undefined =
    teamsData?.teams?.[0] ?? teamsData?.[0];
  if (!team?.id) {
    throw new Error("No Opsway team found for this account.");
  }

  return {
    authenticated: true,
    userId,
    teamId: team.id,
    team,
    error: null,
  };
}
