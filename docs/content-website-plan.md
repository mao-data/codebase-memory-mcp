# 內容網站建置計畫（AI 主題獨立媒體）

> 基於 [Vercel Blog Starter Kit](https://vercel.com/templates/next.js/blog-starter-kit)
> 定位：個人/獨立 AI 媒體｜繁中 + 英文｜零後端、低成本
> 建置位置：本 repo 下新增 `website/` 子目錄

---

## 一、技術架構（無獨立後端）

| 功能 | 方案 | 後端需求 |
|------|------|---------|
| 框架 | Next.js 14 App Router + TypeScript | — |
| 樣式 | Tailwind CSS + shadcn/ui | — |
| 內容管理 | Markdown 檔案 + Git（`_posts/{lang}/{slug}.md`） | ❌ |
| 多語言 | next-intl（`/zh`、`/en`） | ❌ |
| 分類/標籤 | frontmatter `category` + `tags[]` | ❌ |
| 搜尋 | Fuse.js 客戶端模糊搜尋（build 時生成索引） | ❌ |
| 留言 | Giscus（GitHub Discussions 驅動） | ❌ |
| SEO | next-sitemap + Open Graph + JSON-LD | ❌ |
| RSS | 靜態生成 `/rss.xml` | ❌ |
| Analytics | `@next/third-parties` GA4 | ❌ |
| 深色模式 | next-themes | ❌ |
| 部署 | Vercel 免費方案 | ❌ |

成本：個人媒體幾乎零成本，月流量數十萬 PV 不需付費。唯一限制是 Vercel 免費方案
Image Optimization 1000 次/月——圖片多時改用外部 CDN 或 `<img>`。

---

## 二、建置階段（Phase 1–7）

1. **基礎架構**：以 blog-starter-kit 初始化、TS/Tailwind/ESLint、內容目錄結構、remark/rehype Markdown 解析（程式碼高亮、TOC、閱讀時間）。
2. **多語言**：next-intl、`/zh` `/en` 路由、UI 翻譯 JSON、語言切換元件。
3. **分類/標籤**：分類頁 `/[lang]/category/[slug]`、標籤頁 `/[lang]/tag/[slug]`、相關文章側欄。
4. **搜尋**：build 時生成搜尋索引、Fuse.js 即時結果浮層。
5. **留言**：Giscus 整合 + 深淺色同步。
6. **SEO/RSS/GA**：sitemap、OG/Twitter card、Article JSON-LD、RSS feed、GA4。
7. **UI/UX**：首頁 Hero + 最新文章 + 分類導覽；文章頁閱讀進度條、TOC、社群分享；響應式 + 深色模式。

---

## 三、內容計畫（15 篇文章，已完成 AI 動態調查）

文章以繁中撰寫，每篇含 frontmatter（title/date/category/tags/excerpt/coverImage）、
正文 1200–2000 字、引用來源連結。分三大分類，各 5 篇。

### A. 模型動態（category: models）

| # | 標題 | 重點內容 |
|---|------|---------|
| 1 | 2026 前沿模型大戰：Claude Opus 4.8、GPT-5.5、Gemini 3.1 Pro 誰主沉浮 | 四大模型各擅勝場；Opus 4.8 居 Intelligence Index 與多檔工程編碼之首，GPT-5.5 全能與終端任務、Gemini 3.1 Pro 推理（GPQA 94.3%）。 |
| 2 | SWE-bench 解碼：用真實程式碼基準看懂編碼模型排名 | Opus 4.8 SWE-bench Verified 88.6%、Pro 69.2%；Fable 5 Verified 95%；Terminal-Bench、HLE 等基準差異與選型建議。 |
| 3 | 開源模型逆襲：DeepSeek V4、Qwen 3.6、Kimi K2.6、Llama 4 如何追平閉源 | 開源於 2026 多領域追平甚至超越；授權（Apache/MIT）與商用、agentic 編碼、長上下文（Scout 10M）。 |
| 4 | 小而強：端側 SLM 與 Edge AI 的 2026 效率革命 | 7B SLM 比大模型便宜 10–30×；Phi/Gemma/Qwen 端側佈署；Snapdragon 8 Gen 4 60 TOPS；蒸餾小模型推理超越大模型。 |
| 5 | 從聊天到行動：AI Agent、MCP 與多代理協作如何重塑企業 | Gartner 預測 2026 年 40% 企業應用內建 agent；MCP 捐給 Linux 基金會、逾萬台 server；A2A、多代理編排與落地挑戰。 |

### B. 醫療 AI（category: medical）

| # | 標題 | 重點內容 |
|---|------|---------|
| 6 | AI 影像診斷再進化：放射科如何用深度學習提升癌症偵測 | 近 400 個 FDA 核准放射 AI；偽陽性降 5.7%、偽陰性降 9.4%；肺結節、乳腺、攝護腺；EU AI Act 高風險合規。 |
| 7 | AlphaFold 之後：Isomorphic Labs 與 AI 藥物設計進入人體試驗 | IsoDDE 比 AlphaFold 3 準確翻倍；Zovegalisib 進 Phase 3；與 Lilly/Novartis 近 30 億美元合作；2026 年底首個 AI 設計藥進臨床。 |
| 8 | 環境式 AI 醫療文書：減輕醫師過勞的最快落地應用 | RCT 證據；省下 15,791 小時文書、EHR 時間降 8.5%、記錄時間降逾 15%；84% 醫師稱改善溝通、82% 提升滿意度。 |
| 9 | FDA 政策轉向：當生成式 AI 進入臨床決策支援 | 2026/01 CDS 新指引放寬醫材要求；診斷建議類工具免完整審查；predetermined change control plans 可更新權重；安全研究爭議。 |
| 10 | AI 心理健康聊天機器人：研究怎麼說、風險在哪、如何監管 | 中重度成效遜於人類治療師、難辨自殺意念；Brown 研究指違反 APA 倫理；11 州 20 法、紐約三小時提醒；衛教仍有效。 |

### C. 旅遊 AI（category: travel）

| # | 標題 | 重點內容 |
|---|------|---------|
| 11 | AI 旅遊代理人 2026：Layla、Mindtrip、NxVoy 實測比較 | 從聊天機器人進化為策略規劃；行程/機票/住宿/預算分工；Mindtrip 串接 Priceline/Viator 直接訂購。 |
| 12 | Google AI Mode 進軍訂房訂機票：代理式預訂如何運作 | 與 Booking.com、Expedia、Marriott、IHG 等合作；活動票/在地預約已上線；Google 聲明不做 OTA、不當 merchant of record。 |
| 13 | 超個人化旅程：AI 如何重塑飯店與航空的客戶體驗 | 從「該推什麼」轉向「體驗即時調整」；市場 2024 年 9.1 億→2032 年 44.7 億美元（CAGR 22%）；主動偵測延誤自動改訂。 |
| 14 | 智慧機場與生物辨識：2026 無縫旅程的科技底層 | 78% 旅客願分享數位身分；2030 涵蓋 80% 樞紐；Heathrow 自主清潔 cobot 機隊；行李生物辨識全程追蹤。 |
| 15 | Agentic AI 重新定義旅遊業：從規劃到 Bon Voyage 的端到端代理 | IDC 觀點；35% 旅客（Z 世代 50%）用 AI 規劃；跨平台代理協作、自動改訂、即時翻譯與自駕接駁。 |

---

## 四、產出與驗證

- 完成後在 `website/` 內 `npm run build` 驗證可成功靜態生成。
- 15 篇文章放入 `website/_posts/zh/`，frontmatter 完整、來源連結齊全。
- 提供 Vercel 部署說明（`README` 內）與 GA4 / Giscus 環境變數設定指引。
- 全部 commit 至 `claude/content-website-plan-ow552j` 並 push。

> 注意：本 repo 為 C++ MCP 專案，內容網站獨立於 `website/` 子目錄，不影響既有程式。
