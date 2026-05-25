export interface LinkPreview {
  title?: string
  imageUrl?: string
  description?: string
}

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  const trimmed = url.trim()
  if (!trimmed) throw new Error('请先填写商品链接')

  try {
    new URL(trimmed)
  } catch {
    throw new Error('链接格式不正确')
  }

  const endpoint = `https://api.microlink.io?url=${encodeURIComponent(trimmed)}&screenshot=false&video=false&audio=false`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error('链接抓取失败，请稍后重试')

  const json = (await res.json()) as {
    status?: string
    data?: {
      title?: string
      description?: string
      image?: { url?: string }
      logo?: { url?: string }
    }
    message?: string
  }

  if (json.status !== 'success') {
    throw new Error(json.message || '无法解析该链接')
  }

  const imageUrl = json.data?.image?.url || json.data?.logo?.url
  if (!imageUrl && !json.data?.title) {
    throw new Error('该链接没有可用的封面或标题')
  }

  return {
    title: json.data?.title,
    imageUrl,
    description: json.data?.description,
  }
}
