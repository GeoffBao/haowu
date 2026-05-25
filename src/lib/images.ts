import type { Item, ItemCategory } from '../types/item'

export const CATEGORY_FALLBACK_IMAGES: Record<ItemCategory, string> = {
  digital:
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&auto=format&fit=crop',
  fashion:
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&auto=format&fit=crop',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop',
}

export function getItemImage(item: Pick<Item, 'imageUrl' | 'category'>): string {
  if (item.imageUrl?.trim()) return item.imageUrl.trim()
  return CATEGORY_FALLBACK_IMAGES[item.category]
}

export function isLikelyImageUrl(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v.startsWith('data:image/')) return true
  try {
    const url = new URL(v)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export async function readImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件')
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('图片不能超过 8MB')
  }

  const bitmap = await createImageBitmap(file)
  const maxWidth = 960
  const scale = Math.min(1, maxWidth / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法处理图片')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
  if (dataUrl.length > 900_000) {
    throw new Error('图片压缩后仍过大，请换一张更小的图')
  }
  return dataUrl
}
