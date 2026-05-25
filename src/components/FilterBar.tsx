import { Search } from 'lucide-react'
import type { ItemCategory } from '../types/item'
import { CATEGORY_LABELS } from '../types/item'

interface FilterBarProps {
  query: string
  category: ItemCategory | 'all'
  sortBy: 'updated' | 'price' | 'purchaseDate'
  onQueryChange: (q: string) => void
  onCategoryChange: (c: ItemCategory | 'all') => void
  onSortChange: (s: 'updated' | 'price' | 'purchaseDate') => void
}

const CATEGORIES: (ItemCategory | 'all')[] = ['all', 'digital', 'fashion', 'home']

export function FilterBar({
  query,
  category,
  sortBy,
  onQueryChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={16} />
        <input
          type="search"
          placeholder="搜索名称、AI评测、成员…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <select
        className="select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as ItemCategory | 'all')}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c === 'all' ? '全部分类' : CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>
      <select
        className="select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'updated' | 'price' | 'purchaseDate')}
      >
        <option value="updated">最近更新</option>
        <option value="purchaseDate">购买日期</option>
        <option value="price">商品价格</option>
      </select>
    </div>
  )
}
