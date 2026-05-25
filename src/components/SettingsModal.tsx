import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { loadSettings, saveSettings, type AppSettings } from '../lib/settings'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [form, setForm] = useState<AppSettings>({})

  useEffect(() => {
    if (open) setForm(loadSettings())
  }, [open])

  if (!open) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveSettings({
      openaiApiKey: form.openaiApiKey?.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="modal-header">
          <h2>AI 设置</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSave}>
          <label className="field">
            <span>OpenAI API Key</span>
            <input
              type="password"
              value={form.openaiApiKey ?? ''}
              onChange={(e) => setForm({ openaiApiKey: e.target.value })}
              placeholder="sk-..."
              autoComplete="off"
            />
          </label>
          <p className="field-hint">
            仅保存在本机 localStorage，用于「AI 识图填字段」。不配置则只能用手动填写和链接抓封面。
          </p>
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
