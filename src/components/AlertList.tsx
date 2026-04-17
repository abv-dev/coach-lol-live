import type { Alert } from '../types/alert';

interface Props {
  alerts: Alert[];
}

export function AlertList({ alerts }: Props) {
  if (alerts.length === 0) {
    return <div className="alerts-empty">—</div>;
  }

  return (
    <ul className="alerts">
      {alerts.map((a) => (
        <li key={a.id} className={`alert alert-${a.level}`}>
          <span className="alert-dot" />
          <span className="alert-text">{a.text}</span>
        </li>
      ))}
    </ul>
  );
}
