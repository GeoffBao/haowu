import { loadSettings, saveSettings } from './settings'

const SESSION_KEY = 'haowu-session-v1'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID()
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hash = btoa(String.fromCharCode(...new Uint8Array(digest)))
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, expected] = stored.split(':')
  if (!salt || !expected) return false
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hash = btoa(String.fromCharCode(...new Uint8Array(digest)))
  return hash === expected
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function markAuthenticated(): void {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthConfigured(): boolean {
  const settings = loadSettings()
  return Boolean(settings.authUsername && settings.authPasswordHash)
}

export async function login(username: string, password: string): Promise<boolean> {
  const settings = loadSettings()
  if (!settings.authUsername || !settings.authPasswordHash) return false
  if (username.trim() !== settings.authUsername) return false
  const ok = await verifyPassword(password, settings.authPasswordHash)
  if (ok) markAuthenticated()
  return ok
}

export async function setupAuth(username: string, password: string): Promise<void> {
  const { saveSettings } = await import('./settings')
  const current = loadSettings()
  saveSettings({
    ...current,
    authUsername: username.trim(),
    authPasswordHash: await hashPassword(password),
  })
  markAuthenticated()
}
