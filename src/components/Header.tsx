import { Download, LogOut, Plus, Settings, Upload } from 'lucide-react'

interface HeaderProps {
  onAdd: () => void
  onExport: () => void
  onImport: () => void
  onSettings: () => void
  onLogout: () => void
}

export function Header({ onAdd, onExport, onImport, onSettings, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-mark">物</span>
        <div>
          <h1>好物清单</h1>
          <p>记录想买与已买的好东西</p>
        </div>
      </div>
      <div className="header-actions">
        <button type="button" className="btn btn-ghost" onClick={onSettings} title="设置">
          <Settings size={16} />
          <span className="hide-mobile">设置</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onLogout} title="退出登录">
          <LogOut size={16} />
          <span className="hide-mobile">退出</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onImport} title="导入">
          <Upload size={16} />
          <span className="hide-mobile">导入</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onExport} title="导出">
          <Download size={16} />
          <span className="hide-mobile">导出</span>
        </button>
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          <Plus size={16} />
          添加好物
        </button>
      </div>
    </header>
  )
}
