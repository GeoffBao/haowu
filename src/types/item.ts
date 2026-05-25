export type ItemStatus =
  | 'saving'
  | 'watching'
  | 'installment'
  | 'purchased'
  | 'archived'

export type ItemCategory = 'digital' | 'fashion' | 'home'

export type ConsumeType = 'impulse' | 'reasonable' | 'necessary'

export interface Item {
  id: string
  name: string
  category: ItemCategory
  status: ItemStatus
  price?: number
  link?: string
  consumeType?: ConsumeType
  savedAmount?: number
  paidAmount?: number
  installmentCount?: number
  installmentRemaining?: number
  purchaseDate?: string
  aiReview?: string
  imageUrl?: string
  members?: string[]
  createdAt: string
  updatedAt: string
}

export type ItemInput = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>

export const STATUS_LABELS: Record<ItemStatus, string> = {
  saving: '存钱中',
  watching: '观望中',
  installment: '分期中',
  purchased: '已购买',
  archived: '已归档',
}

export const STATUS_COLORS: Record<ItemStatus, string> = {
  saving: 'var(--status-saving)',
  watching: 'var(--status-watching)',
  installment: 'var(--status-installment)',
  purchased: 'var(--status-purchased)',
  archived: 'var(--status-archived)',
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  digital: '数码产品',
  fashion: '服装穿戴',
  home: '家居产品',
}

export const CONSUME_TYPE_LABELS: Record<ConsumeType, string> = {
  impulse: '冲动消费 / 5%',
  reasonable: '合理消费 / 20%',
  necessary: '必要消费 / 50%',
}

export const CONSUME_TYPE_RATIOS: Record<ConsumeType, number> = {
  impulse: 0.05,
  reasonable: 0.2,
  necessary: 0.5,
}

export type ViewFilter = 'all' | ItemStatus

export const VIEW_LABELS: Record<ViewFilter, string> = {
  all: '全部',
  saving: '存钱中',
  watching: '观望中',
  installment: '分期中',
  purchased: '已购买',
  archived: '已归档',
}

export const VIEW_ORDER: ViewFilter[] = [
  'all',
  'saving',
  'watching',
  'installment',
  'purchased',
  'archived',
]
