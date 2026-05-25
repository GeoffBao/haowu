import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Item } from '../types/item'
import {
  CATEGORY_LABELS,
  CONSUME_TYPE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../types/item'
import {
  getDailyCost,
  getDaysUsed,
  getPurchaseAdvice,
  getRequiredSavings,
  getSavingsProgress,
  previewText,
} from '../lib/formulas'
import { formatPrice } from '../lib/utils'
import { ItemCover } from './ItemCover'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const advice = getPurchaseAdvice(item)
  const progress = getSavingsProgress(item)
  const required = getRequiredSavings(item)
  const daysUsed = getDaysUsed(item)
  const dailyCost = getDailyCost(item)
  const showSavingFields =
    item.status === 'saving' || item.status === 'watching' || item.status === 'installment'
  const showPurchasedFields = item.status === 'purchased'

  return (
    <article className="item-card">
      <ItemCover item={item} />
      <div className="item-card-body">
        <div className="item-card-top">
          <span className="item-status" style={{ color: STATUS_COLORS[item.status] }}>
            {STATUS_LABELS[item.status]}
          </span>
          <span className="item-category">{CATEGORY_LABELS[item.category]}</span>
        </div>

        <h3 className="item-name">{item.name}</h3>

        <div className="item-card-footer">
          <span className="item-price">{formatPrice(item)}</span>
          {item.consumeType && (
            <span className="item-consume">{CONSUME_TYPE_LABELS[item.consumeType]}</span>
          )}
        </div>

        <p className="item-advice">{advice}</p>

        {showSavingFields && progress != null && required != null && (
          <div className="progress-block">
            <div className="progress-head">
              <span>存款进度</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-meta">
              ¥{(item.savedAmount ?? 0).toLocaleString()} / ¥{required.toLocaleString()}
            </p>
          </div>
        )}

        {item.status === 'installment' && (
          <p className="item-meta">
            已还 ¥{(item.paidAmount ?? 0).toLocaleString()}
            {item.installmentRemaining != null &&
              ` · 待还 ¥${item.installmentRemaining.toLocaleString()}`}
          </p>
        )}

        {showPurchasedFields && daysUsed != null && (
          <div className="metric-row">
            <span>已使用 {daysUsed} 天</span>
            {dailyCost != null && <span>每日成本 ¥{dailyCost.toLocaleString()}</span>}
          </div>
        )}

        {item.purchaseDate && (
          <p className="item-date">
            购买于 {format(new Date(item.purchaseDate), 'yyyy/MM/dd')}
          </p>
        )}

        {item.aiReview && <p className="item-notes">{previewText(item.aiReview)}</p>}

        <div className="item-actions">
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <ExternalLink size={14} />
              链接
            </a>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(item)}>
            <Pencil size={14} />
            编辑
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-danger"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
