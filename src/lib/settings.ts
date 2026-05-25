const SETTINGS_KEY = 'haowu-settings-v2'

export type AiProvider = 'deepseek' | 'openai'

export interface AppSettings {
  authUsername?: string
  authPasswordHash?: string
  aiProvider?: AiProvider
  openaiApiKey?: string
  deepseekApiKey?: string
}

function migrateV1(): AppSettings {
  try {
    const raw = localStorage.getItem('haowu-settings-v1')
    if (!raw) return {}
    const old = JSON.parse(raw) as { openaiApiKey?: string }
    return {
      aiProvider: 'openai',
      openaiApiKey: old.openaiApiKey,
    }
  } catch {
    return {}
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return migrateV1()
    return JSON.parse(raw) as AppSettings
  } catch {
    return {}
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getActiveApiKey(): string | null {
  const settings = loadSettings()
  if (settings.aiProvider === 'openai') {
    return settings.openaiApiKey?.trim() || null
  }
  return settings.deepseekApiKey?.trim() || settings.openaiApiKey?.trim() || null
}

export function getActiveProvider(): AiProvider {
  const settings = loadSettings()
  return settings.aiProvider ?? 'deepseek'
}

export function hasAiKey(): boolean {
  return Boolean(getActiveApiKey())
}

export function hasOpenAiKey(): boolean {
  return Boolean(loadSettings().openaiApiKey?.trim())
}
