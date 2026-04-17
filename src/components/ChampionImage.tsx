import { useState } from 'react';
import { championSquareUrl } from '../services/ddragon';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export function ChampionImage({ name, size = 48, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`champ-img champ-img-fallback ${className}`}
        style={{ width: size, height: size }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={championSquareUrl(name)}
      alt={name}
      width={size}
      height={size}
      className={`champ-img ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
