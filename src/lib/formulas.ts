import { differenceInDays } from 'date-fns'
import type { Item } from '../types/item'
import { CONSUME_TYPE_RATIOS } from '../types/item'

export function getRequiredSavings(item: Item): number | null {
  if (item.price == null || !item.consumeType) return null
  return Math.round(item.price * CONSUME_TYPE_RATIOS[item.consumeType])
}

export function getSavingsProgress(item: Item): number | null {
  const required = getRequiredSavings(item)
  if (required == null || required === 0) return null
  const saved = item.savedAmount ?? 0
  return Math.min(100, Math.round((saved / required) * 100))
}

export function getPurchaseAdvice(item: Item): string {
  if (item.status === 'purchased') return '已入手，关注每日使用成本'
  if (item.status === 'archived') return '已归档，暂不考虑'
  if (item.status === 'installment') {
    const remaining = item.installmentRemaining ?? 0
    return remaining > 0 ? `分期进行中，待还 ¥${remaining.toLocaleString()}` : '分期即将完成'
  }
  if (item.status === 'watching') return '先观望，不急于下单'

  const progress = getSavingsProgress(item)
  if (progress == null) return '设定消费类型后，系统会给出存款目标'
  if (progress >= 100) return '存款已达标，可以考虑入手'
  if (progress >= 70) return '进度良好，继续坚持攒钱'
  if (progress >= 40) return '已完成部分目标，稳住节奏'
  if (progress > 0) return '才开始攒，别冲动消费'
  return '先设定存款目标再行动'
}

export function getDaysUsed(item: Item): number | null {
  if (item.status !== 'purchased' || !item.purchaseDate) return null
  const days = differenceInDays(new Date(), new Date(item.purchaseDate))
  return Math.max(0, days)
}

export function getDailyCost(item: Item): number | null {
  if (item.price == null) return null
  const days = getDaysUsed(item)
  if (days == null) return null
  return Math.round((item.price / Math.max(1, days)) * 100) / 100
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*/g, '')
    .replace(/^#+\s*/gm, '')
    .trim()
}

export function previewText(text: string, max = 120): string {
  const plain = stripHtml(text).replace(/\s+/g, ' ')
  if (plain.length <= max) return plain
  return `${plain.slice(0, max)}…`
}
