import type { ObjectiveTimers } from '../logic/objectiveTimer';
import { formatTime } from '../logic/objectiveTimer';

interface Props {
  timers: ObjectiveTimers;
}

export function ObjectiveBar({ timers }: Props) {
  const items: Array<{ label: string; time: number | null; emoji: string }> = [
    { label: 'DRAKE',  time: timers.nextDragonIn, emoji: '🐉' },
    { label: 'BARON',  time: timers.nextBaronIn, emoji: '🪱' },
    { label: 'HERALD', time: timers.nextHeraldIn, emoji: '👁' },
  ];

  return (
    <div className="obj-bar">
      {items.map((it) => {
        const unavail = it.time === null;
        const soon = !unavail && it.time! < 60;
        const up = !unavail && it.time! <= 0;
        return (
          <div key={it.label} className={`obj ${soon ? 'soon' : ''} ${up ? 'up' : ''} ${unavail ? 'unavail' : ''}`}>
            <span className="obj-emoji">{it.emoji}</span>
            <span className="obj-label">{it.label}</span>
            <span className="obj-time">{unavail ? '—' : up ? 'UP' : formatTime(it.time!)}</span>
          </div>
        );
      })}
    </div>
  );
}
