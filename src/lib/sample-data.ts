import type { Item } from '../types/item'

const now = new Date().toISOString()

export const sampleItems: Item[] = [
  {
    id: '1',
    name: 'Macbook Pro',
    category: 'digital',
    status: 'saving',
    price: 33499,
    link: 'https://www.apple.com/hk/macbook-pro/',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&auto=format&fit=crop',
    consumeType: 'impulse',
    savedAmount: 8000,
    aiReview:
      'Macbook Pro 搭载 M 系列芯片，性能与能效出色，适合视频编辑与开发。价格较高，建议按存款进度理性入手。',
    members: ['Eason'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    name: 'Ipad mini 6 64G WLAN版',
    category: 'digital',
    status: 'purchased',
    price: 3999,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
    consumeType: 'reasonable',
    purchaseDate: '2022-10-08',
    aiReview:
      'A15 芯片 + 8.3 寸屏，便携性很好。64G 日常够用，支持 Apple Pencil 二代，性价比不错。',
    members: ['Eason'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    name: 'xiaomi SU7',
    category: 'home',
    status: 'saving',
    price: 299900,
    imageUrl:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    consumeType: 'impulse',
    savedAmount: 45000,
    aiReview: '小米 SU7，智能生态联动强。大额消费，务必按 5% 存款目标慢慢攒。',
    members: ['Eason'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    name: 'DJI Mavic 3',
    category: 'home',
    status: 'watching',
    price: 19179,
    imageUrl:
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80&auto=format&fit=crop',
    consumeType: 'impulse',
    savedAmount: 2000,
    aiReview: '5.1K 视频 + 46 分钟续航，航拍画质顶级。高价位，适合先观望再决定。',
    members: ['Eason'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '5',
    name: '龙柏五村79号102室｜商业贷',
    category: 'home',
    status: 'installment',
    price: 3200000,
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop',
    consumeType: 'necessary',
    paidAmount: 960000,
    installmentCount: 360,
    installmentRemaining: 2240000,
    purchaseDate: '2024-11-20',
    aiReview: '必要消费类大额资产，分期还款周期较长，需持续跟踪已还金额。',
    members: ['Eason'],
    createdAt: now,
    updatedAt: now,
  },
]

export const SAMPLE_IMAGE_BY_NAME: Record<string, string> = Object.fromEntries(
  sampleItems.map((item) => [item.name, item.imageUrl ?? '']),
)
