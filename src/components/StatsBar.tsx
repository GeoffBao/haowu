import type { Item } from '../types/item'
import { totalSavingTarget, totalSpent } from '../lib/utils'

interface StatsBarProps {
  items: Item[]
}

export function StatsBar({ items }: StatsBarProps) {
  const purchased = items.filter((i) => i.status === 'purchased').length
  const saving = items.filter((i) => i.status === 'saving').length
  const spent = totalSpent(items)
  const saved = totalSavingTarget(items)

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-value">{items.length}</span>
        <span className="stat-label">全部好物</span>
      </div>
      <div className="stat">
        <span className="stat-value">{purchased}</span>
        <span className="stat-label">已购买</span>
      </div>
      <div className="stat">
        <span className="stat-value">{saving}</span>
        <span className="stat-label">存钱中</span>
      </div>
      <div className="stat">
        <span className="stat-value">¥{spent.toLocaleString()}</span>
        <span className="stat-label">已购总额</span>
      </div>
      <div className="stat">
        <span className="stat-value">¥{saved.toLocaleString()}</span>
        <span className="stat-label">在攒金额</span>
      </div>
    </div>
  )
}
