import type { Item } from '../types/item'
import { SAMPLE_IMAGE_BY_NAME, sampleItems } from './sample-data'
import { CATEGORY_FALLBACK_IMAGES } from './images'

const STORAGE_KEY = 'haowu-items-v3'
const LEGACY_KEYS = ['haowu-items-v2', 'haowu-items-v1']

function withFallbackImage(item: Item): Item {
  if (item.imageUrl?.trim()) return item
  const known = SAMPLE_IMAGE_BY_NAME[item.name]
  if (known) return { ...item, imageUrl: known }
  return { ...item, imageUrl: CATEGORY_FALLBACK_IMAGES[item.category] }
}

function readLegacyItems(): Item[] | null {
  for (const key of LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as Item[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(withFallbackImage)
      }
    } catch {
      continue
    }
  }
  return null
}

export function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Item[]
    return Array.isArray(parsed) ? parsed.map(withFallbackImage) : []
  } catch {
    return []
  }
}

export function saveItems(items: Item[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function exportItems(items: Item[]): string {
  return JSON.stringify(items, null, 2)
}

export function importItems(json: string): Item[] {
  const parsed = JSON.parse(json) as Item[]
  if (!Array.isArray(parsed)) throw new Error('Invalid format')
  return parsed.map(withFallbackImage)
}

export function getInitialItems(): Item[] {
  const stored = loadItems()
  if (stored.length > 0) return stored

  const legacy = readLegacyItems()
  if (legacy) {
    saveItems(legacy)
    return legacy
  }

  return sampleItems
}
