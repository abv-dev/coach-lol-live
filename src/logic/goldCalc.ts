import type { AllGameData, AllPlayer, Team } from '../types/liveClient';
import itemsDbRaw from '../data/items.json';

interface ItemEntry {
  gold: { total: number };
}

interface ItemsDb {
  data: Record<string, ItemEntry>;
}

const db = itemsDbRaw as unknown as ItemsDb;

export function playerItemsValue(p: AllPlayer): number {
  return p.items.reduce((sum, item) => {
    const entry = db.data[String(item.itemID)];
    const cost = entry?.gold.total ?? item.price ?? 0;
    return sum + cost;
  }, 0);
}

export function teamItemsValue(players: AllPlayer[], team: Team): number {
  return players
    .filter((p) => p.team === team)
    .reduce((sum, p) => sum + playerItemsValue(p), 0);
}

export interface ItemsValueCompare {
  myTeam: number;
  enemyTeam: number;
  diff: number;
}

export function teamItemsValueCompare(data: AllGameData): ItemsValueCompare {
  const me = data.allPlayers.find((p) => p.summonerName === data.activePlayer.summonerName);
  const myTeamId: Team = me?.team ?? 'ORDER';
  const enemyTeamId: Team = myTeamId === 'ORDER' ? 'CHAOS' : 'ORDER';

  const myTeam = teamItemsValue(data.allPlayers, myTeamId);
  const enemyTeam = teamItemsValue(data.allPlayers, enemyTeamId);

  return { myTeam, enemyTeam, diff: myTeam - enemyTeam };
}
