import { describe, it, expect } from 'vitest';
import { formatEvent, recentEvents } from '../eventHistory';

describe('formatEvent', () => {
  it('formate ChampionKill', () => {
    const text = formatEvent({
      EventID: 1, EventName: 'ChampionKill', EventTime: 500,
      KillerName: 'JgAlly', VictimName: 'TopEnemy',
    });
    expect(text).toContain('JgAlly');
    expect(text).toContain('TopEnemy');
  });

  it('formate DragonKill avec type', () => {
    const text = formatEvent({
      EventID: 2, EventName: 'DragonKill', EventTime: 300,
      KillerName: 'JgAlly', DragonType: 'Infernal',
    });
    expect(text).toContain('Infernal');
  });

  it('marque STOLEN', () => {
    const text = formatEvent({
      EventID: 3, EventName: 'BaronKill', EventTime: 1500,
      KillerName: 'JgEnemy', Stolen: 'True',
    });
    expect(text).toContain('STOLEN');
  });

  it('formate FirstBlood', () => {
    const text = formatEvent({
      EventID: 4, EventName: 'FirstBlood', EventTime: 180,
      KillerName: 'JgAlly',
    });
    expect(text).toContain('FirstBlood');
  });
});

describe('recentEvents', () => {
  it('retourne les events les plus récents en tête', () => {
    const events = [
      { EventID: 1, EventName: 'GameStart', EventTime: 0 },
      { EventID: 2, EventName: 'ChampionKill', EventTime: 500, KillerName: 'A', VictimName: 'B' },
      { EventID: 3, EventName: 'DragonKill', EventTime: 600, KillerName: 'A', DragonType: 'Infernal' },
    ];
    const recent = recentEvents(events, 2);
    expect(recent).toHaveLength(2);
    expect(recent[0]!.id).toBe(3);
  });

  it('filtre MinionsSpawning', () => {
    const events = [
      { EventID: 1, EventName: 'MinionsSpawning', EventTime: 65 },
      { EventID: 2, EventName: 'ChampionKill', EventTime: 500, KillerName: 'A', VictimName: 'B' },
    ];
    const recent = recentEvents(events);
    expect(recent.some((e) => e.text.includes('Minions'))).toBe(false);
  });
});
