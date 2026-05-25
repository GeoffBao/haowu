import type { Item, ItemCategory, ItemStatus } from '../types/item'
import {
  CATEGORY_LABELS,
  CONSUME_TYPE_LABELS,
  STATUS_LABELS,
} from '../types/item'

export function formatPrice(item: Item): string {
  if (item.price == null) return '—'
  return `¥${item.price.toLocaleString()}`
}

export function filterItems(
  items: Item[],
  view: 'all' | ItemStatus,
  category: ItemCategory | 'all',
  query: string,
): Item[] {
  return items.filter((item) => {
    if (view !== 'all' && item.status !== view) return false
    if (category !== 'all' && item.category !== category) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      const haystack = [
        item.name,
        item.aiReview,
        item.members?.join(' '),
        STATUS_LABELS[item.status],
        CATEGORY_LABELS[item.category],
        item.consumeType ? CONSUME_TYPE_LABELS[item.consumeType] : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function sortItems(
  items: Item[],
  sortBy: 'updated' | 'price' | 'purchaseDate',
): Item[] {
  return [...items].sort((a, b) => {
    if (sortBy === 'price') return (b.price ?? 0) - (a.price ?? 0)
    if (sortBy === 'purchaseDate') {
      const aDate = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0
      const bDate = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0
      return bDate - aDate
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function countByStatus(items: Item[]) {
  return {
    all: items.length,
    saving: items.filter((i) => i.status === 'saving').length,
    watching: items.filter((i) => i.status === 'watching').length,
    installment: items.filter((i) => i.status === 'installment').length,
    purchased: items.filter((i) => i.status === 'purchased').length,
    archived: items.filter((i) => i.status === 'archived').length,
  }
}

export function totalSpent(items: Item[]): number {
  return items
    .filter((i) => i.status === 'purchased')
    .reduce((sum, i) => sum + (i.price ?? 0), 0)
}

export function totalSavingTarget(items: Item[]): number {
  return items
    .filter((i) => i.status === 'saving' || i.status === 'watching')
    .reduce((sum, i) => sum + (i.savedAmount ?? 0), 0)
}
