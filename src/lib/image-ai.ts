import type { ItemCategory } from '../types/item'
import { visionCompletion } from './ai-client'

export interface ImageAnalysis {
  name?: string
  price?: number
  category?: ItemCategory
  aiReview?: string
}

const VALID_CATEGORIES: ItemCategory[] = ['digital', 'fashion', 'home']

function parseAnalysis(raw: string): ImageAnalysis {
  const parsed = JSON.parse(raw) as Record<string, unknown>
  const category = parsed.category
  return {
    name: typeof parsed.name === 'string' ? parsed.name.trim() : undefined,
    price: typeof parsed.price === 'number' && parsed.price > 0 ? Math.round(parsed.price) : undefined,
    category:
      typeof category === 'string' && VALID_CATEGORIES.includes(category as ItemCategory)
        ? (category as ItemCategory)
        : undefined,
    aiReview: typeof parsed.aiReview === 'string' ? parsed.aiReview.trim() : undefined,
  }
}

export async function analyzeProductImage(imageUrl: string): Promise<ImageAnalysis> {
  const content = await visionCompletion(
    [
      '识别这张商品图片，返回 JSON，字段：',
      'name(中文商品名), price(人民币整数或null), category(digital|fashion|home), aiReview(2-3句中文购买建议)。',
      '只输出 JSON。',
    ].join(''),
    imageUrl,
  )
  return parseAnalysis(content)
}
