import type { AllGameData, Team } from '../types/liveClient';

export interface DragonState {
  orderKills: number;
  chaosKills: number;
  soulTeam: Team | null;
  soulType: string | null;
}

export function computeDragonState(data: AllGameData): DragonState {
  const playerTeam = new Map<string, Team>();
  for (const p of data.allPlayers) playerTeam.set(p.summonerName, p.team);

  const kills = data.events.Events
    .filter((e) => e.EventName === 'DragonKill')
    .sort((a, b) => a.EventTime - b.EventTime);

  let orderKills = 0;
  let chaosKills = 0;
  let soulTeam: Team | null = null;
  let soulType: string | null = null;

  for (const e of kills) {
    const team = e.KillerName ? playerTeam.get(e.KillerName) : undefined;
    if (team === 'ORDER') orderKills++;
    else if (team === 'CHAOS') chaosKills++;

    if (!soulTeam && team && (team === 'ORDER' ? orderKills : chaosKills) >= 4) {
      soulTeam = team;
      soulType = e.DragonType ?? null;
    }
  }

  return { orderKills, chaosKills, soulTeam, soulType };
}
