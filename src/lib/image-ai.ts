import type { ItemCategory } from '../types/item'

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

export async function analyzeProductImage(
  imageUrl: string,
  apiKey: string,
): Promise<ImageAnalysis> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: [
                '识别这张商品图片，返回 JSON，字段：',
                'name(中文商品名), price(人民币整数或null), category(digital|fashion|home), aiReview(2-3句中文购买建议)。',
                '只输出 JSON。',
              ].join(''),
            },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(err?.error?.message || `AI 请求失败 (${res.status})`)
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = json.choices?.[0]?.message?.content
  if (!content) throw new Error('AI 未返回有效结果')
  return parseAnalysis(content)
}
