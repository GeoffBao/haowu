import { useState } from 'react'
import { isAuthConfigured, login, setupAuth } from '../lib/auth'

interface AuthGateProps {
  onSuccess: () => void
}

export function AuthGate({ onSuccess }: AuthGateProps) {
  const setupMode = !isAuthConfigured()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (setupMode) {
        if (!username.trim() || password.length < 6) {
          setError('用户名必填，密码至少 6 位')
          return
        }
        if (password !== confirm) {
          setError('两次密码不一致')
          return
        }
        await setupAuth(username, password)
      } else {
        const ok = await login(username, password)
        if (!ok) {
          setError('用户名或密码错误')
          return
        }
      }
      onSuccess()
    } catch {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <span className="header-mark">物</span>
        <h1>{setupMode ? '初始化账号' : '登录好物清单'}</h1>
        <p>{setupMode ? '首次使用，请设置登录用户名和密码' : '请输入账号密码继续'}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>用户名</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
          </label>
          <label className="field">
            <span>密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={setupMode ? 'new-password' : 'current-password'}
              placeholder="至少 6 位"
            />
          </label>
          {setupMode && (
            <label className="field">
              <span>确认密码</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </label>
          )}
          {error && <p className="field-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? '处理中…' : setupMode ? '创建并进入' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
