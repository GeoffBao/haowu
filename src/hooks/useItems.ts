import { useCallback, useEffect, useState } from 'react'
import { exportItems, getInitialItems, importItems, saveItems } from '../lib/storage'
import type { Item, ItemInput } from '../types/item'

function createId(): string {
  return crypto.randomUUID()
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(getInitialItems())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveItems(items)
  }, [items, ready])

  const addItem = useCallback((input: ItemInput) => {
    const now = new Date().toISOString()
    const item: Item = { ...input, id: createId(), createdAt: now, updatedAt: now }
    setItems((prev) => [item, ...prev])
    return item
  }, [])

  const updateItem = useCallback((id: string, input: Partial<ItemInput>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const exportData = useCallback(() => exportItems(items), [items])

  const importData = useCallback((json: string) => {
    const imported = importItems(json)
    setItems(imported)
  }, [])

  return {
    items,
    ready,
    addItem,
    updateItem,
    deleteItem,
    exportData,
    importData,
  }
}
