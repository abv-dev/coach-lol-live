import { describe, it, expect } from 'vitest';
import { findDirectOpponent } from '../directOpponent';
import { makeGameData, withItem } from './fixtures';

describe('findDirectOpponent', () => {
  it('trouve l\'opponent sur la même position', () => {
    const data = makeGameData();
    const m = findDirectOpponent(data);
    expect(m.me?.championName).toBe('Ornn');
    expect(m.opponent?.championName).toBe('Darius');
  });

  it('retourne opponent null si position = NONE', () => {
    const data = makeGameData();
    const you = data.allPlayers.find((p) => p.summonerName === 'You')!;
    you.position = '';
    const m = findDirectOpponent(data);
    expect(m.opponent).toBeNull();
  });

  it('la diff est items only (pas de currentGold)', () => {
    let data = makeGameData();
    data = withItem(data, 'You', 3031, 3400, 0);
    data.activePlayer.currentGold = 5000;
    const m = findDirectOpponent(data);
    expect(m.myItemsValue).toBeLessThan(4000);
    expect(m.myItemsValue).toBeGreaterThan(3000);
  });
});
