import { useEffect, useState } from 'react';
import { isAudioEnabled, setAudioEnabled } from '../services/audioAlerts';

export function AudioToggle() {
  const [enabled, setEnabled] = useState<boolean>(isAudioEnabled());

  useEffect(() => {
    setAudioEnabled(enabled);
  }, [enabled]);

  return (
    <button
      className={`audio-toggle ${enabled ? 'on' : 'off'}`}
      onClick={() => setEnabled((v) => !v)}
      title={enabled ? 'Rappels audio activés' : 'Rappels audio désactivés'}
    >
      <span className="audio-icon">{enabled ? '🔊' : '🔇'}</span>
      <span className="audio-label">Rappels audio</span>
    </button>
  );
}
