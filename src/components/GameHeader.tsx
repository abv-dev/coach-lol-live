import type { ConnectionState } from '../services/liveClient';
import logo from '../assets/logo.png';

interface Props {
  gameTime: number;
  state: ConnectionState;
  mockMode: boolean;
  onToggleMock: () => void;
  view: 'dashboard' | 'micro';
  onToggleView: () => void;
}

function fmt(seconds: number): string {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function GameHeader({ gameTime, state, mockMode, onToggleMock, view, onToggleView }: Props) {
  return (
    <header className="gh">
      <div className="gh-left">
        <img src={logo} alt="Coach LoL Live" className="gh-logo" />
        <div className="gh-brand">
          <div className="gh-title">COACH<span className="gh-accent">LOL</span>LIVE</div>
          <div className="gh-tagline">Dashboard factuel temps réel</div>
        </div>
      </div>
      <div className="gh-center">
        <span className={`gh-live gh-live-${state}`}>
          <span className="gh-live-dot" />
          <span>{state === 'connected' ? 'LIVE' : state === 'mock' ? 'MOCK' : 'OFF'}</span>
        </span>
        <span className="gh-time">{fmt(gameTime)}</span>
      </div>
      <div className="gh-right">
        <button className={`gh-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={onToggleView}>
          {view === 'dashboard' ? '→ MICRO' : '→ DASHBOARD'}
        </button>
        <button className="gh-btn" onClick={onToggleMock}>
          {mockMode ? 'LIVE' : 'MOCK'}
        </button>
      </div>
    </header>
  );
}
