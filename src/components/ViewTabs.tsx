import type { ViewFilter } from '../types/item'
import { VIEW_LABELS, VIEW_ORDER } from '../types/item'

interface ViewTabsProps {
  active: ViewFilter
  counts: Record<ViewFilter, number>
  onChange: (view: ViewFilter) => void
}

export function ViewTabs({ active, counts, onChange }: ViewTabsProps) {
  return (
    <nav className="view-tabs" aria-label="视图筛选">
      {VIEW_ORDER.map((view) => (
        <button
          key={view}
          type="button"
          className={`view-tab ${active === view ? 'active' : ''}`}
          onClick={() => onChange(view)}
        >
          {VIEW_LABELS[view]}
          <span className="view-count">{counts[view]}</span>
        </button>
      ))}
    </nav>
  )
}
