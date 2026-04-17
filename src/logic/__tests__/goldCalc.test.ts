import { describe, it, expect } from 'vitest';
import { playerItemsValue, teamItemsValue, teamItemsValueCompare } from '../goldCalc';
import { makeGameData, withItem } from './fixtures';

describe('playerItemsValue', () => {
  it('retourne 0 pour un joueur sans items', () => {
    const data = makeGameData();
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(playerItemsValue(you)).toBe(0);
  });

  it('somme les prix des items via items_db', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 3031, 3400, 0); // Infinity Edge
    data = withItem(data, 'You', 3094, 2600, 1); // Rapid Firecannon
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    const value = playerItemsValue(you);
    expect(value).toBeGreaterThan(5000);
    expect(value).toBeLessThan(7000);
  });

  it('ne prend JAMAIS en compte currentGold (pas de biais)', () => {
    const data = makeGameData();
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    expect(playerItemsValue(you)).toBe(0);
  });
});

describe('teamItemsValue', () => {
  it('somme la valeur items de tous les joueurs de l\'équipe', () => {
    let data = makeGameData();
    data = withItem(data, 'You',    3031, 3400, 0);
    data = withItem(data, 'JgAlly', 3071, 3300, 0);
    const sum = teamItemsValue(data.allPlayers, 'ORDER');
    // items_db patch 16.7 fait foi; on vérifie juste ordre de grandeur
    expect(sum).toBeGreaterThan(5000);
    expect(sum).toBeLessThan(8000);
  });
});

describe('teamItemsValueCompare', () => {
  it('calcule une diff positive quand notre team a plus d\'items', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 3031, 3400, 0);
    const cmp = teamItemsValueCompare(data);
    expect(cmp.diff).toBeGreaterThan(0);
    expect(cmp.myTeam).toBeGreaterThan(cmp.enemyTeam);
  });

  it('calcule une diff négative quand ennemi a plus d\'items', () => {
    let data = makeGameData();
    data = withItem(data, 'TopEnemy', 6630, 3300, 0);
    const cmp = teamItemsValueCompare(data);
    expect(cmp.diff).toBeLessThan(0);
  });
});
