import { useState } from 'react'
import type { Item } from '../types/item'
import { getItemImage } from '../lib/images'

interface ItemCoverProps {
  item: Pick<Item, 'name' | 'imageUrl' | 'category'>
  className?: string
}

export function ItemCover({ item, className = '' }: ItemCoverProps) {
  const [src, setSrc] = useState(() => getItemImage(item))

  return (
    <div className={`item-cover ${className}`.trim()}>
      <img
        src={src}
        alt={item.name}
        loading="lazy"
        onError={() => setSrc(getItemImage({ ...item, imageUrl: undefined }))}
      />
    </div>
  )
}
