import { getActiveApiKey, getActiveProvider, type AiProvider } from './settings'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
}

interface ChatOptions {
  json?: boolean
  temperature?: number
  provider?: AiProvider
  apiKey?: string
}

const ENDPOINTS: Record<AiProvider, string> = {
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
}

const MODELS: Record<AiProvider, string> = {
  deepseek: 'deepseek-chat',
  openai: 'gpt-4o-mini',
}

export async function chatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<string> {
  const provider = options.provider ?? getActiveProvider()
  const apiKey = options.apiKey ?? getActiveApiKey()
  if (!apiKey) throw new Error('请先在设置中配置 API Key')

  const body: Record<string, unknown> = {
    model: MODELS[provider],
    temperature: options.temperature ?? 0.4,
    messages,
  }
  if (options.json) body.response_format = { type: 'json_object' }

  const res = await fetch(ENDPOINTS[provider], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(err?.error?.message || `AI 请求失败 (${res.status})`)
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = json.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('AI 未返回有效结果')
  return content
}

export async function visionCompletion(
  prompt: string,
  imageUrl: string,
  apiKey?: string,
): Promise<string> {
  const key = apiKey ?? getActiveApiKey()
  if (!key) throw new Error('请先在设置中配置 OpenAI API Key')

  return chatCompletion(
    [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    { json: true, provider: 'openai', apiKey: key, temperature: 0.2 },
  )
}
