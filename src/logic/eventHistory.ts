import type { GameEvent } from '../types/liveClient';

export interface FormattedEvent {
  id: number;
  time: string;
  text: string;
}

function formatGameTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatEvent(ev: GameEvent): string {
  switch (ev.EventName) {
    case 'GameStart': return 'Game start';
    case 'MinionsSpawning': return 'Minions spawn';
    case 'FirstBlood': return `FirstBlood · ${ev.KillerName ?? '?'}`;
    case 'ChampionKill': {
      const assists = ev.Assisters?.length ? ` (+${ev.Assisters.length})` : '';
      return `${ev.KillerName ?? '?'} kills ${ev.VictimName ?? '?'}${assists}`;
    }
    case 'Multikill': return `Multikill · ${ev.KillerName ?? '?'}`;
    case 'Ace': return `ACE · ${ev.KillerName ?? '?'}`;
    case 'TurretKilled': return `Tour · ${ev.TurretKilled ?? '?'}`;
    case 'InhibKilled': return `Inhib down`;
    case 'DragonKill': {
      const type = ev.DragonType ? ` ${ev.DragonType}` : '';
      const stolen = ev.Stolen === 'True' ? ' STOLEN' : '';
      return `Drake${type} · ${ev.KillerName ?? '?'}${stolen}`;
    }
    case 'HeraldKill': return `Herald · ${ev.KillerName ?? '?'}`;
    case 'BaronKill': {
      const stolen = ev.Stolen === 'True' ? ' STOLEN' : '';
      return `Baron · ${ev.KillerName ?? '?'}${stolen}`;
    }
    default: return ev.EventName;
  }
}

export function recentEvents(events: GameEvent[], limit = 6): FormattedEvent[] {
  return [...events]
    .filter((e) => e.EventName !== 'MinionsSpawning')
    .reverse()
    .slice(0, limit)
    .map((ev) => ({
      id: ev.EventID,
      time: formatGameTime(ev.EventTime),
      text: formatEvent(ev),
    }));
}
