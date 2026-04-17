import { describe, it, expect } from 'vitest';
import { countCompletedItems, teamItemsCompleted, findNextItemCandidates } from '../itemProgress';
import { makeGameData, withItem } from './fixtures';

describe('countCompletedItems', () => {
  it('retourne 0 pour un joueur sans items', () => {
    const data = makeGameData();
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(countCompletedItems(you)).toBe(0);
  });

  it('compte un item complet (cost >= 2000, pas d\'into)', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 3031, 3400, 0); // Infinity Edge = final
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(countCompletedItems(you)).toBe(1);
  });

  it('ne compte pas les consumables ou composants', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 1038, 1300, 0); // B.F. Sword (composant)
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(countCompletedItems(you)).toBe(0);
  });
});

describe('teamItemsCompleted', () => {
  it('somme les items complétés de chaque joueur', () => {
    let data = makeGameData();
    data = withItem(data, 'You',    3031, 3400, 0);
    data = withItem(data, 'JgAlly', 3071, 3300, 0);
    const order = data.allPlayers.filter((p) => p.team === 'ORDER');
    expect(teamItemsCompleted(order)).toBe(2);
  });
});

describe('findNextItemCandidates', () => {
  it('retourne vide si le joueur n\'a aucun composant', () => {
    const data = makeGameData();
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(findNextItemCandidates(you, 0)).toEqual([]);
  });

  it('propose des upgrades basés sur les composants possédés', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 1038, 1300, 0); // B.F. Sword → upgrade vers IE, etc.
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    const candidates = findNextItemCandidates(you, 500);
    expect(candidates.length).toBeGreaterThan(0);
    candidates.forEach((c) => {
      expect(c.name).toBeTruthy();
      expect(c.totalCost).toBeGreaterThanOrEqual(1500);
    });
  });
});
