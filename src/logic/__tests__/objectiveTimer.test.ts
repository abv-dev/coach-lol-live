import { describe, it, expect } from 'vitest';
import { computeObjectives, formatTime } from '../objectiveTimer';
import { makeGameData, withEvents } from './fixtures';

describe('formatTime', () => {
  it('formate minutes:secondes', () => {
    expect(formatTime(0)).toBe('NOW');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(600)).toBe('10:00');
  });

  it('retourne NOW pour <= 0', () => {
    expect(formatTime(0)).toBe('NOW');
    expect(formatTime(-5)).toBe('NOW');
  });
});

describe('computeObjectives', () => {
  it('drake first spawn à 5:00', () => {
    const data = { ...makeGameData(), gameData: { ...makeGameData().gameData, gameTime: 60 } };
    const obj = computeObjectives(data);
    expect(obj.nextDragonIn).toBe(240); // 300 - 60
  });

  it('drake respawn à +5min après kill', () => {
    let data = makeGameData();
    data = withEvents(data, [{ EventID: 1, EventName: 'DragonKill', EventTime: 400, KillerName: 'JgAlly' }]);
    data = { ...data, gameData: { ...data.gameData, gameTime: 500 } };
    const obj = computeObjectives(data);
    expect(obj.nextDragonIn).toBe(200); // 400 + 300 - 500
  });

  it('baron dispo à 20min puis respawn 6min', () => {
    const data = { ...makeGameData(), gameData: { ...makeGameData().gameData, gameTime: 1000 } };
    const obj = computeObjectives(data);
    expect(obj.nextBaronIn).toBe(200); // 1200 - 1000
  });

  it('herald désactivé une fois baron spawné', () => {
    const data = { ...makeGameData(), gameData: { ...makeGameData().gameData, gameTime: 1250 } };
    const obj = computeObjectives(data);
    expect(obj.nextHeraldIn).toBeNull();
  });

  it('primary = objectif le plus proche', () => {
    const data = { ...makeGameData(), gameData: { ...makeGameData().gameData, gameTime: 100 } };
    const obj = computeObjectives(data);
    expect(obj.primary.name).toBe('Drake');
  });
});
