import { useEffect, useState } from 'react';
import { useT, getTips, useLang } from '../i18n';

export function WaitingScreen() {
  const t = useT();
  const lang = useLang();
  const [tips, setTips] = useState<string[]>(getTips());
  const [tipIdx, setTipIdx] = useState<number>(() => Math.floor(Math.random() * tips.length));

  useEffect(() => {
    setTips(getTips());
  }, [lang]);

  useEffect(() => {
    if (tips.length === 0) return;
    const id = setInterval(() => {
      setTipIdx((i) => (i + 1) % tips.length);
    }, 6000);
    return () => clearInterval(id);
  }, [tips]);

  const tip = tips[tipIdx] ?? '';

  return (
    <div className="screen-waiting">
      <div className="waiting-bg" />
      <div className="waiting-anim">
        <div className="waiting-orb waiting-orb-1" />
        <div className="waiting-orb waiting-orb-2" />
        <div className="waiting-orb waiting-orb-3" />
      </div>
      <h2 className="waiting-title">{t('waiting.title')}</h2>
      <p className="waiting-subtitle">{t('waiting.subtitle')}</p>

      <div className="waiting-tip" key={tipIdx}>
        <span className="tip-icon">💡</span>
        <span className="tip-text">{tip}</span>
      </div>
    </div>
  );
}
