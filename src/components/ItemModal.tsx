import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { ConsumeType, Item, ItemCategory, ItemInput, ItemStatus } from '../types/item'
import {
  CATEGORY_LABELS,
  CONSUME_TYPE_LABELS,
  STATUS_LABELS,
} from '../types/item'
import {
  getDailyCost,
  getDaysUsed,
  getPurchaseAdvice,
  getRequiredSavings,
  getSavingsProgress,
} from '../lib/formulas'
import { getItemImage, readImageFile } from '../lib/images'
import { generateAiReview } from '../lib/ai-review'
import { analyzeProductImage } from '../lib/image-ai'
import { fetchLinkPreview } from '../lib/link-preview'
import { hasAiKey, hasOpenAiKey } from '../lib/settings'
import { ItemCover } from './ItemCover'

interface ItemModalProps {
  item?: Item | null
  open: boolean
  onClose: () => void
  onSave: (input: ItemInput, id?: string) => void
}

const emptyForm: ItemInput = {
  name: '',
  category: 'digital',
  status: 'saving',
  price: undefined,
  link: '',
  consumeType: 'reasonable',
  savedAmount: undefined,
  paidAmount: undefined,
  installmentCount: undefined,
  installmentRemaining: undefined,
  purchaseDate: '',
  aiReview: '',
  imageUrl: '',
  members: [],
}

export function ItemModal({ item, open, onClose, onSave }: ItemModalProps) {
  const [form, setForm] = useState<ItemInput>(emptyForm)
  const [membersText, setMembersText] = useState('')
  const [imageError, setImageError] = useState('')
  const [smartError, setSmartError] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        status: item.status,
        price: item.price,
        link: item.link ?? '',
        consumeType: item.consumeType ?? 'reasonable',
        savedAmount: item.savedAmount,
        paidAmount: item.paidAmount,
        installmentCount: item.installmentCount,
        installmentRemaining: item.installmentRemaining,
        purchaseDate: item.purchaseDate ?? '',
        aiReview: item.aiReview ?? '',
        imageUrl: item.imageUrl ?? '',
        members: item.members ?? [],
      })
      setMembersText((item.members ?? []).join(', '))
    } else {
      setForm(emptyForm)
      setMembersText('')
    }
  }, [item, open])

  const previewItem = useMemo<Item>(
    () => ({
      ...form,
      id: item?.id ?? 'preview',
      createdAt: item?.createdAt ?? new Date().toISOString(),
      updatedAt: item?.updatedAt ?? new Date().toISOString(),
      members: membersText
        .split(/[,，]/)
        .map((m) => m.trim())
        .filter(Boolean),
    }),
    [form, item, membersText],
  )

  const advice = getPurchaseAdvice(previewItem)
  const progress = getSavingsProgress(previewItem)
  const required = getRequiredSavings(previewItem)
  const daysUsed = getDaysUsed(previewItem)
  const dailyCost = getDailyCost(previewItem)

  if (!open) return null

  const set = <K extends keyof ItemInput>(key: K, value: ItemInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const buildInput = (source: ItemInput = form): ItemInput => ({
    ...source,
    name: source.name.trim(),
    link: source.link || undefined,
    purchaseDate: source.purchaseDate || undefined,
    aiReview: source.aiReview || undefined,
    imageUrl: source.imageUrl || undefined,
    members: membersText
      .split(/[,，]/)
      .map((m) => m.trim())
      .filter(Boolean),
  })

  const runGenerateReview = async (source: ItemInput): Promise<string | undefined> => {
    if (!hasAiKey()) return undefined
    return generateAiReview(buildInput(source))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setSubmitting(true)
    setSmartError('')
    try {
      let payload = buildInput()
      if (!payload.aiReview?.trim()) {
        setReviewLoading(true)
        try {
          const review = await runGenerateReview(form)
          if (review) payload = { ...payload, aiReview: review }
        } catch (err) {
          setSmartError(err instanceof Error ? err.message : 'AI 评测生成失败')
          return
        } finally {
          setReviewLoading(false)
        }
      }
      onSave(payload, item?.id)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setImageError('')
      setSmartError('')
      const dataUrl = await readImageFile(file)
      set('imageUrl', dataUrl)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '图片上传失败')
    }
  }

  const handleFetchFromLink = async () => {
    if (!form.link?.trim()) {
      setSmartError('请先填写商品链接')
      return
    }
    setLinkLoading(true)
    setSmartError('')
    try {
      const preview = await fetchLinkPreview(form.link)
      const merged: ItemInput = {
        ...form,
        imageUrl: preview.imageUrl ?? form.imageUrl,
        name: form.name.trim() ? form.name : (preview.title ?? form.name),
      }
      setForm(merged)

      if (hasAiKey()) {
        setReviewLoading(true)
        try {
          const review = await runGenerateReview(merged)
          if (review) setForm((prev) => ({ ...prev, aiReview: review }))
        } catch (err) {
          setSmartError(err instanceof Error ? err.message : 'AI 评测生成失败')
        } finally {
          setReviewLoading(false)
        }
      }
    } catch (err) {
      setSmartError(err instanceof Error ? err.message : '链接抓取失败')
    } finally {
      setLinkLoading(false)
    }
  }

  const handleAnalyzeImage = async () => {
    if (!hasOpenAiKey()) {
      setSmartError('AI 识图需在「设置」中配置 OpenAI API Key')
      return
    }

    const imageUrl = getItemImage({
      category: form.category,
      imageUrl: form.imageUrl,
    })

    setAiLoading(true)
    setSmartError('')
    try {
      const result = await analyzeProductImage(imageUrl)
      setForm((prev) => ({
        ...prev,
        name: result.name || prev.name,
        price: result.price ?? prev.price,
        category: result.category ?? prev.category,
      }))
      if (result.aiReview) {
        setForm((prev) => ({ ...prev, aiReview: result.aiReview }))
      } else if (hasAiKey()) {
        const review = await runGenerateReview({
          ...form,
          name: result.name || form.name,
          price: result.price ?? form.price,
          category: result.category ?? form.category,
        })
        if (review) setForm((prev) => ({ ...prev, aiReview: review }))
      }
    } catch (err) {
      setSmartError(err instanceof Error ? err.message : 'AI 识图失败')
    } finally {
      setAiLoading(false)
    }
  }

  const handleGenerateReview = async () => {
    if (!form.name.trim()) {
      setSmartError('请先填写商品名称')
      return
    }
    if (!hasAiKey()) {
      setSmartError('请先在「设置」中配置 DeepSeek 或 OpenAI API Key')
      return
    }
    setReviewLoading(true)
    setSmartError('')
    try {
      const review = await runGenerateReview(form)
      if (review) set('aiReview', review)
    } catch (err) {
      setSmartError(err instanceof Error ? err.message : 'AI 评测生成失败')
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{item ? '编辑好物' : '添加好物'}</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>商品名称 *</span>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Macbook Pro"
            />
          </label>

          <div className="image-field">
            <span className="field-label">物品图片</span>
            <ItemCover
              item={{
                name: form.name || '好物',
                category: form.category,
                imageUrl: form.imageUrl,
              }}
              className="modal-cover"
            />
            <div className="image-actions">
              <label className="btn btn-ghost btn-sm">
                本地上传
                <input type="file" accept="image/*" hidden onChange={handleImageFile} />
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={aiLoading}
                onClick={handleAnalyzeImage}
              >
                {aiLoading ? '识图中…' : 'AI 识图填字段'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => set('imageUrl', '')}
              >
                清除图片
              </button>
            </div>
            {!hasOpenAiKey() && (
              <p className="field-hint">AI 识图需在「设置」中配置 OpenAI API Key</p>
            )}
            <input
              value={form.imageUrl?.startsWith('data:') ? '' : (form.imageUrl ?? '')}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="或粘贴图片 URL（留空则用分类默认图）"
            />
            {form.imageUrl?.startsWith('data:') && (
              <p className="field-hint">已使用本地上传的图片</p>
            )}
            {imageError && <p className="field-error">{imageError}</p>}
          </div>

          <div className="field-row">
            <label className="field">
              <span>购买状态</span>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as ItemStatus)}
              >
                {(Object.keys(STATUS_LABELS) as ItemStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>物品类别</span>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as ItemCategory)}
              >
                {(Object.keys(CATEGORY_LABELS) as ItemCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>商品价格</span>
              <input
                type="number"
                min={0}
                step={1}
                value={form.price ?? ''}
                onChange={(e) =>
                  set('price', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="0"
              />
            </label>
            <label className="field">
              <span>消费类型</span>
              <select
                value={form.consumeType ?? 'reasonable'}
                onChange={(e) => set('consumeType', e.target.value as ConsumeType)}
              >
                {(Object.keys(CONSUME_TYPE_LABELS) as ConsumeType[]).map((c) => (
                  <option key={c} value={c}>
                    {CONSUME_TYPE_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>商品链接</span>
            <div className="link-row">
              <input
                type="url"
                value={form.link}
                onChange={(e) => set('link', e.target.value)}
                placeholder="https://"
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={linkLoading || !form.link?.trim()}
                onClick={handleFetchFromLink}
              >
                {linkLoading ? '抓取中…' : '抓取封面'}
              </button>
            </div>
          </label>

          {smartError && <p className="field-error">{smartError}</p>}

          {(form.status === 'saving' || form.status === 'watching') && (
            <label className="field">
              <span>已存金额</span>
              <input
                type="number"
                min={0}
                step={1}
                value={form.savedAmount ?? ''}
                onChange={(e) =>
                  set('savedAmount', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="当前攒了多少钱"
              />
            </label>
          )}

          {form.status === 'installment' && (
            <div className="field-row">
              <label className="field">
                <span>已还金额</span>
                <input
                  type="number"
                  min={0}
                  value={form.paidAmount ?? ''}
                  onChange={(e) =>
                    set('paidAmount', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </label>
              <label className="field">
                <span>待分期额</span>
                <input
                  type="number"
                  min={0}
                  value={form.installmentRemaining ?? ''}
                  onChange={(e) =>
                    set(
                      'installmentRemaining',
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </label>
              <label className="field">
                <span>分期次数</span>
                <input
                  type="number"
                  min={0}
                  value={form.installmentCount ?? ''}
                  onChange={(e) =>
                    set('installmentCount', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </label>
            </div>
          )}

          {(form.status === 'purchased' || form.status === 'installment') && (
            <label className="field">
              <span>购买日期</span>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => set('purchaseDate', e.target.value)}
              />
            </label>
          )}

          <label className="field">
            <span>购买成员</span>
            <input
              value={membersText}
              onChange={(e) => setMembersText(e.target.value)}
              placeholder="Eason, 家人"
            />
          </label>

          <div className="field">
            <div className="field-head">
              <span className="field-label">AI 评测</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={reviewLoading}
                onClick={handleGenerateReview}
              >
                {reviewLoading ? '生成中…' : '重新生成'}
              </button>
            </div>
            <textarea
              rows={4}
              readOnly
              value={form.aiReview ?? ''}
              placeholder={
                hasAiKey()
                  ? '保存时自动生成，或点击「重新生成」'
                  : '请先在设置中配置 API Key，保存时将自动生成'
              }
            />
            {!hasAiKey() && (
              <p className="field-hint">默认使用 DeepSeek 生成 AI 评测</p>
            )}
          </div>

          <div className="computed-panel">
            <p>
              <strong>购买意见：</strong>
              {advice}
            </p>
            {progress != null && required != null && (
              <p>
                <strong>存款进度：</strong>
                {progress}%（目标 ¥{required.toLocaleString()}）
              </p>
            )}
            {daysUsed != null && (
              <p>
                <strong>已使用天数：</strong>
                {daysUsed} 天
                {dailyCost != null && ` · 每日成本 ¥${dailyCost.toLocaleString()}`}
              </p>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || reviewLoading}>
              {submitting ? '保存中…' : item ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
