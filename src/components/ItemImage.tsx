import { useState } from 'react';
import { itemIconUrl } from '../services/ddragon';

interface Props {
  itemId: number;
  size?: number;
}

export function ItemImage({ itemId, size = 28 }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !itemId) {
    return (
      <div className="item-img item-img-empty" style={{ width: size, height: size }} />
    );
  }

  return (
    <img
      src={itemIconUrl(itemId)}
      alt={`item-${itemId}`}
      width={size}
      height={size}
      className="item-img"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
