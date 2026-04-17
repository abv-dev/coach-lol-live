import type { FormattedEvent } from '../logic/eventHistory';

interface Props {
  events: FormattedEvent[];
}

export function LiveFeed({ events }: Props) {
  return (
    <div className="live-feed">
      <div className="lf-title">LIVE FEED</div>
      {events.length === 0 ? (
        <div className="lf-empty">En attente d'events...</div>
      ) : (
        <ul className="lf-list">
          {events.map((ev) => (
            <li key={ev.id} className="lf-item">
              <span className="lf-time">{ev.time}</span>
              <span className="lf-text">{ev.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
