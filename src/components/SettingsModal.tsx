import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { hashPassword } from '../lib/auth'
import { loadSettings, saveSettings, type AiProvider, type AppSettings } from '../lib/settings'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [form, setForm] = useState<AppSettings>({})
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(loadSettings())
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    }
  }, [open])

  if (!open) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const next: AppSettings = {
      ...loadSettings(),
      authUsername: form.authUsername?.trim() || undefined,
      aiProvider: form.aiProvider ?? 'deepseek',
      openaiApiKey: form.openaiApiKey?.trim() || undefined,
      deepseekApiKey: form.deepseekApiKey?.trim() || undefined,
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError('新密码至少 6 位')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('两次密码不一致')
        return
      }
      next.authPasswordHash = await hashPassword(newPassword)
    }

    saveSettings(next)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="modal-header">
          <h2>设置</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSave}>
          <h3 className="settings-section">账号</h3>
          <label className="field">
            <span>用户名</span>
            <input
              value={form.authUsername ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, authUsername: e.target.value }))}
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>新密码（留空则不修改）</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="field">
            <span>确认新密码</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <h3 className="settings-section">AI</h3>
          <label className="field">
            <span>AI 提供商</span>
            <select
              value={form.aiProvider ?? 'deepseek'}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, aiProvider: e.target.value as AiProvider }))
              }
            >
              <option value="deepseek">DeepSeek（推荐，用于 AI 评测）</option>
              <option value="openai">OpenAI</option>
            </select>
          </label>
          <label className="field">
            <span>DeepSeek API Key</span>
            <input
              type="password"
              value={form.deepseekApiKey ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, deepseekApiKey: e.target.value }))}
              placeholder="sk-..."
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span>OpenAI API Key</span>
            <input
              type="password"
              value={form.openaiApiKey ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, openaiApiKey: e.target.value }))}
              placeholder="sk-..."
              autoComplete="off"
            />
          </label>
          <p className="field-hint">
            Key 仅保存在本机 localStorage。DeepSeek 负责 AI 评测；OpenAI 额外支持识图填字段。
          </p>
          {error && <p className="field-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
