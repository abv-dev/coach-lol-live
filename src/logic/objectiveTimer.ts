import type { AllGameData, GameEvent } from '../types/liveClient';

const DRAGON_RESPAWN = 5 * 60;
const BARON_RESPAWN = 6 * 60;
const HERALD_SPAWN = 14 * 60;
const BARON_FIRST_SPAWN = 20 * 60;
const DRAGON_FIRST_SPAWN = 5 * 60;
const GRUBS_FIRST_SPAWN = 6 * 60;
const GRUBS_DISAPPEAR_AT = 14 * 60;

export interface ObjectiveTimers {
  nextDragonIn: number;
  nextDragonAt: number;
  nextBaronIn: number;
  nextBaronAt: number;
  nextHeraldIn: number | null;
  nextHeraldAt: number | null;
  nextGrubsIn: number | null;
  nextGrubsAt: number | null;
  primary: { name: string; inSeconds: number };
}

function lastEventTime(events: GameEvent[], name: string): number | null {
  const matching = events.filter((e) => e.EventName === name);
  if (matching.length === 0) return null;
  return Math.max(...matching.map((e) => e.EventTime));
}

export function computeObjectives(data: AllGameData): ObjectiveTimers {
  const events = data.events.Events;
  const now = data.gameData.gameTime;

  const lastDragon = lastEventTime(events, 'DragonKill');
  const nextDragonAt = lastDragon === null ? DRAGON_FIRST_SPAWN : lastDragon + DRAGON_RESPAWN;
  const nextDragonIn = Math.max(0, nextDragonAt - now);

  const lastBaron = lastEventTime(events, 'BaronKill');
  const nextBaronAt = lastBaron === null ? BARON_FIRST_SPAWN : lastBaron + BARON_RESPAWN;
  const nextBaronIn = Math.max(0, nextBaronAt - now);

  const heraldKilled = lastEventTime(events, 'HeraldKill') !== null;
  const heraldGone = heraldKilled || now >= BARON_FIRST_SPAWN;
  const nextHeraldAt = heraldGone ? null : HERALD_SPAWN;
  const nextHeraldIn = heraldGone ? null : Math.max(0, HERALD_SPAWN - now);

  // Grubs : spawn à 6:00, disparaissent à 14:00 (remplacés par Herald)
  const grubsGone = now >= GRUBS_DISAPPEAR_AT;
  const nextGrubsAt = grubsGone ? null : GRUBS_FIRST_SPAWN;
  const nextGrubsIn = grubsGone ? null : Math.max(0, GRUBS_FIRST_SPAWN - now);

  const candidates: Array<{ name: string; inSeconds: number }> = [
    { name: 'Drake', inSeconds: nextDragonIn },
    { name: 'Baron', inSeconds: nextBaronIn },
  ];
  if (nextHeraldIn !== null) candidates.push({ name: 'Herald', inSeconds: nextHeraldIn });
  if (nextGrubsIn !== null) candidates.push({ name: 'Grubs', inSeconds: nextGrubsIn });

  const primary = candidates.reduce((a, b) => (a.inSeconds <= b.inSeconds ? a : b));

  return {
    nextDragonIn, nextDragonAt,
    nextBaronIn, nextBaronAt,
    nextHeraldIn, nextHeraldAt,
    nextGrubsIn, nextGrubsAt,
    primary,
  };
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) return 'NOW';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
