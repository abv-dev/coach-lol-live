import type { UpdateStatus } from '../services/updater';

interface Props {
  status: UpdateStatus;
}

export function UpdateBanner({ status }: Props) {
  if (status.kind === 'idle' || status.kind === 'none') return null;

  let label = '';
  let tone = 'info';

  switch (status.kind) {
    case 'checking':    label = 'Recherche de mises à jour…'; break;
    case 'available':   label = `Update v${status.version} disponible — téléchargement…`; tone = 'warn'; break;
    case 'downloading': label = `Téléchargement ${status.percent}%`; tone = 'warn'; break;
    case 'installing':  label = 'Installation — redémarrage imminent…'; tone = 'warn'; break;
    case 'error':       label = `Update échouée : ${status.message}`; tone = 'error'; break;
  }

  return (
    <div className={`update-banner update-banner-${tone}`}>
      <span className="update-dot" />
      <span>{label}</span>
    </div>
  );
}
