import { PackageOpen, Plus } from 'lucide-react'

interface EmptyStateProps {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <PackageOpen size={48} strokeWidth={1.2} />
      <h2>还没有好物</h2>
      <p>添加第一件你想买或已买的好东西吧</p>
      <button type="button" className="btn btn-primary" onClick={onAdd}>
        <Plus size={16} />
        添加好物
      </button>
    </div>
  )
}
