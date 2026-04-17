import type { AllPlayer } from '../types/liveClient';
import itemsDbRaw from '../data/items.json';

interface ItemEntry {
  name: string;
  gold: { base: number; total: number; purchasable: boolean; sell: number };
  from?: string[];
  into?: string[];
}

interface ItemsDb {
  data: Record<string, ItemEntry>;
}

const db = itemsDbRaw as unknown as ItemsDb;

export function countCompletedItems(player: AllPlayer): number {
  return player.items.filter((it) => {
    const entry = db.data[String(it.itemID)];
    if (!entry) return it.price >= 2000;
    return entry.gold.total >= 2000 && (!entry.into || entry.into.length === 0);
  }).length;
}

export function teamItemsCompleted(players: AllPlayer[]): number {
  return players.reduce((sum, p) => sum + countCompletedItems(p), 0);
}

export interface NextItemCandidate {
  id: string;
  name: string;
  totalCost: number;
  componentsOwned: number;
  goldStillNeeded: number;
}

export function findNextItemCandidates(
  player: AllPlayer,
  currentGold: number,
): NextItemCandidate[] {
  const ownedIds = new Set(player.items.map((i) => String(i.itemID)));
  const candidates: NextItemCandidate[] = [];

  for (const ownedId of ownedIds) {
    const entry = db.data[ownedId];
    if (!entry?.into) continue;

    for (const upgradeId of entry.into) {
      const upgrade = db.data[upgradeId];
      if (!upgrade || !upgrade.gold.purchasable) continue;
      if (upgrade.gold.total < 1500) continue;

      const components = upgrade.from ?? [];
      const ownedComponentsCost = components
        .filter((c) => ownedIds.has(c))
        .reduce((sum, c) => sum + (db.data[c]?.gold.total ?? 0), 0);

      const stillNeeded = Math.max(0, upgrade.gold.total - ownedComponentsCost - currentGold);

      candidates.push({
        id: upgradeId,
        name: upgrade.name,
        totalCost: upgrade.gold.total,
        componentsOwned: components.filter((c) => ownedIds.has(c)).length,
        goldStillNeeded: stillNeeded,
      });
    }
  }

  candidates.sort((a, b) => a.goldStillNeeded - b.goldStillNeeded);
  return candidates.slice(0, 3);
}
