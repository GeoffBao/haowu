# 好物清单 (Haowu)

个人好物管理 Web App，对齐 Notion「好物清单」：存款进度、购买意见、每日成本、Gallery 封面图。

**在线访问：** https://geoffbao.github.io/haowu/

## 功能

- 好物 CRUD（名称、分类、状态、价格、消费类型、链接、图片、AI 评测等）
- 视图：全部 / 存钱中 / 观望中 / 分期中 / 已购买 / 已归档
- 自动计算：存款进度、购买意见、已使用天数、每日成本
- 从商品链接抓取封面（Microlink）
- AI 识图填字段（OpenAI API Key，存 localStorage）
- JSON 导入 / 导出，localStorage 持久化

## 本地开发

```bash
npm install
npm run dev
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动部署到 GitHub Pages。

```bash
npm run build        # 本地预览构建
GITHUB_PAGES=true npm run build   # 模拟 Pages 路径
npm run preview
```

## 后续

Mac / iOS 可复用 `src/types/item.ts` 数据模型，后端同步后替换 `src/lib/storage.ts`。
