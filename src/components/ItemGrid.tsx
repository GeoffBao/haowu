import type { Item } from '../types/item'
import { ItemCard } from './ItemCard'

interface ItemGridProps {
  items: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
}

export function ItemGrid({ items, onEdit, onDelete }: ItemGridProps) {
  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
