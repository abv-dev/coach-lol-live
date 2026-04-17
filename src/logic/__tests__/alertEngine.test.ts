import { describe, it, expect } from 'vitest';
import { computeAlerts } from '../alertEngine';
import { makeGameData } from './fixtures';

describe('computeAlerts', () => {
  it('pas d\'alertes par défaut', () => {
    const data = makeGameData();
    data.activePlayer.currentGold = 500;
    data.activePlayer.championStats.currentHealth = 1000;
    data.activePlayer.championStats.maxHealth = 1140;
    data.activePlayer.championStats.resourceValue = 300;
    data.activePlayer.championStats.resourceMax = 400;
    const alerts = computeAlerts(data);
    expect(alerts.filter((a) => a.level === 'critical')).toEqual([]);
  });

  it('alerte HP critical si < 25%', () => {
    const data = makeGameData();
    data.activePlayer.championStats.currentHealth = 200;
    data.activePlayer.championStats.maxHealth = 1140;
    const alerts = computeAlerts(data);
    expect(alerts.some((a) => a.id === 'hp-critical' && a.level === 'critical')).toBe(true);
  });

  it('alerte gold stash si >= 2000', () => {
    const data = makeGameData();
    data.activePlayer.currentGold = 2500;
    const alerts = computeAlerts(data);
    expect(alerts.some((a) => a.id === 'gold-stash')).toBe(true);
  });

  it('alertes triées critical > warn > info', () => {
    const data = makeGameData();
    data.activePlayer.championStats.currentHealth = 200;
    data.activePlayer.championStats.maxHealth = 1140;
    data.activePlayer.currentGold = 2500;
    const alerts = computeAlerts(data);
    if (alerts.length > 1) {
      const levels = alerts.map((a) => a.level);
      const order = { critical: 0, warn: 1, info: 2 };
      for (let i = 1; i < levels.length; i++) {
        expect(order[levels[i]!]).toBeGreaterThanOrEqual(order[levels[i - 1]!]);
      }
    }
  });

  it('alerte drake soon quand < 60s', () => {
    const data = makeGameData();
    data.gameData.gameTime = 250; // drake spawn à 300
    const alerts = computeAlerts(data);
    expect(alerts.some((a) => a.id === 'drake-soon')).toBe(true);
  });
});
