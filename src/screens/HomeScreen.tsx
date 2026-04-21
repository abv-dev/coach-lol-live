import logo from '../assets/logo.png';
import { useT } from '../i18n';

interface Props {
  onStart: () => void;
  onDemo: () => void;
  version: string;
}

interface Feature {
  icon: string;
  titleKey: string;
  bodyKey: string;
}

const FEATURES: Feature[] = [
  { icon: '📊', titleKey: 'home.features.dashboard.title', bodyKey: 'home.features.dashboard.body' },
  { icon: '🪟', titleKey: 'home.features.overlay.title', bodyKey: 'home.features.overlay.body' },
  { icon: '🔊', titleKey: 'home.features.audio.title', bodyKey: 'home.features.audio.body' },
  { icon: '🎯', titleKey: 'home.features.factual.title', bodyKey: 'home.features.factual.body' },
];

export function HomeScreen({ onStart, onDemo, version }: Props) {
  const t = useT();

  return (
    <div className="screen-home-v2">
      <div className="home-halo" />

      <header className="home-hero">
        <img src={logo} alt="Candor" className="home-logo-big" />
        <h1 className="home-brand">
          CAN<span className="accent-gold">DOR</span>
        </h1>
        <p className="home-tagline">{t('home.hero.tagline')}</p>

        <div className="home-cta-row">
          <button className="home-cta home-cta-primary" onClick={onStart}>
            {t('home.cta.start')}
          </button>
          <button className="home-cta home-cta-secondary" onClick={onDemo}>
            {t('home.cta.demo')}
          </button>
        </div>
      </header>

      <section className="home-features">
        <h2 className="home-section-title">{t('home.features.title')}</h2>
        <div className="home-feature-grid">
          {FEATURES.map((f) => (
            <div key={f.titleKey} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <div className="home-feature-title">{t(f.titleKey)}</div>
              <div className="home-feature-body">{t(f.bodyKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-philo">
        <h2 className="home-section-title">{t('home.philo.title')}</h2>
        <p className="home-philo-body">{t('home.philo.body')}</p>
      </section>

      <footer className="home-footer">
        <span className="home-version">v{version}</span>
      </footer>
    </div>
  );
}
