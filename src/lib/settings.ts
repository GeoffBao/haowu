const SETTINGS_KEY = 'haowu-settings-v1'

export interface AppSettings {
  openaiApiKey?: string
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as AppSettings
  } catch {
    return {}
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function hasOpenAiKey(): boolean {
  return Boolean(loadSettings().openaiApiKey?.trim())
}
