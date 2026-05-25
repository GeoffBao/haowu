import type { ItemInput } from '../types/item'
import {
  CATEGORY_LABELS,
  CONSUME_TYPE_LABELS,
  STATUS_LABELS,
} from '../types/item'
import { chatCompletion } from './ai-client'

export async function generateAiReview(input: ItemInput): Promise<string> {
  if (!input.name.trim()) throw new Error('请先填写商品名称')

  const lines = [
    `商品名称：${input.name}`,
    input.price != null ? `价格：¥${input.price}` : null,
    `分类：${CATEGORY_LABELS[input.category]}`,
    `状态：${STATUS_LABELS[input.status]}`,
    input.consumeType ? `消费类型：${CONSUME_TYPE_LABELS[input.consumeType]}` : null,
    input.link ? `链接：${input.link}` : null,
    input.members?.length ? `购买成员：${input.members.join('、')}` : null,
  ].filter(Boolean)

  const content = await chatCompletion([
    {
      role: 'system',
      content:
        '你是消费决策助手。根据商品信息写一段中文 AI 评测，2-4 句，客观、实用，包含优缺点与是否值得买。不要 markdown，不要标题，直接输出正文。',
    },
    {
      role: 'user',
      content: lines.join('\n'),
    },
  ])

  return content.replace(/^#+\s*/gm, '').trim()
}
