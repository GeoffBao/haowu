import { useMemo, useRef, useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { EmptyState } from './components/EmptyState'
import { FilterBar } from './components/FilterBar'
import { Header } from './components/Header'
import { ItemGrid } from './components/ItemGrid'
import { ItemModal } from './components/ItemModal'
import { SettingsModal } from './components/SettingsModal'
import { StatsBar } from './components/StatsBar'
import { ViewTabs } from './components/ViewTabs'
import { useItems } from './hooks/useItems'
import { isAuthenticated, logout } from './lib/auth'
import { countByStatus, filterItems, sortItems } from './lib/utils'
import type { Item, ItemCategory, ItemInput, ViewFilter } from './types/item'

function App() {
  const { items, ready, addItem, updateItem, deleteItem, exportData, importData } =
    useItems()

  const [authed, setAuthed] = useState(isAuthenticated)
  const [view, setView] = useState<ViewFilter>('all')
  const [category, setCategory] = useState<ItemCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'price' | 'purchaseDate'>('updated')
  const [modalOpen, setModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const counts = useMemo(() => countByStatus(items), [items])

  const visibleItems = useMemo(
    () => sortItems(filterItems(items, view, category, query), sortBy),
    [items, view, category, query, sortBy],
  )

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (item: Item) => {
    setEditing(item)
    setModalOpen(true)
  }

  const handleSave = (input: ItemInput, id?: string) => {
    if (id) updateItem(id, input)
    else addItem(input)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定删除这条好物？')) deleteItem(id)
  }

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `haowu-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => fileRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importData(String(reader.result))
      } catch {
        alert('导入失败，请检查 JSON 格式')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleLogout = () => {
    logout()
    setAuthed(false)
  }

  if (!authed) {
    return <AuthGate onSuccess={() => setAuthed(true)} />
  }

  if (!ready) return null

  return (
    <div className="app">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleFileChange}
      />

      <Header
        onAdd={openAdd}
        onExport={handleExport}
        onImport={handleImport}
        onSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <main className="main">
        <StatsBar items={items} />
        <ViewTabs active={view} counts={counts} onChange={setView} />
        <FilterBar
          query={query}
          category={category}
          sortBy={sortBy}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
        />

        {visibleItems.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <ItemGrid items={visibleItems} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>

      <ItemModal
        item={editing}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
