# 分發管道自動化設定指南

本文件說明如何把網站文章「自動」分發到電子報與社群平台，不需每篇手動貼文。
所有工具都是外部服務（需用你自己的帳號登入設定），網站端已準備好 RSS feed 供串接。

## 你的 RSS Feed 網址

| 語言 | 網址 |
|------|------|
| 繁中 | `https://你的網域/api/rss?locale=zh` |
| 英文 | `https://你的網域/api/rss?locale=en` |

Feed 已包含完整文章內容（`content:encoded`）、分類與標籤，適合 RSS-to-Email 與社群自動轉貼。

---

## 一、電子報自動化（RSS → Email）

一有新文章，系統自動打包成電子報寄給訂閱者。**擇一即可。**

### 方案 A：Substack（最簡單，免費）
1. 到 [substack.com](https://substack.com) 建立 publication
2. Settings → 找到你的 publish/import 設定，開啟 **RSS import**，填入上方 RSS 網址
3. 取得訂閱表單的 action URL（通常是 `https://你的名稱.substack.com/api/v1/free`）
4. 把該網址填進 `.env.local` 的 `NEXT_PUBLIC_NEWSLETTER_ACTION_URL`，重新部署
   → 網站上的訂閱表單就會直接串到 Substack

### 方案 B：ConvertKit / Kit（自動化彈性大，免費 1,000 人以下）
1. 到 [kit.com](https://kit.com) 註冊
2. **Automate → RSS**：新增 RSS feed，設定發送頻率（每週/每有新文）
3. **Grow → Landing Pages & Forms** 建立表單，複製表單的 action URL
4. 同樣填入 `.env.local` 的 `NEXT_PUBLIC_NEWSLETTER_ACTION_URL`

### 方案 C：Mailchimp（RSS Campaign）
1. Mailchimp → **Campaigns → RSS Campaign**
2. 貼上 RSS 網址，設定每週寄送
3. 表單 action URL 填入 `.env.local`

> 建議：起步用 **Substack**（零設定成本、內建付費訂閱功能），成長後若要更多自動化再轉 ConvertKit。

---

## 二、社群自動發文（RSS → X / LinkedIn / Threads）

新文章發布後，自動發社群貼文。**擇一即可。**

### 方案 A：Buffer / Publer（最直覺，免費～$6/月）
1. 到 [buffer.com](https://buffer.com) 或 [publer.com](https://publer.com) 註冊，連接 X / LinkedIn / Facebook 帳號
2. 找到 **RSS Feed / Auto-post from RSS** 功能，貼上 RSS 網址
3. 設定貼文模板，例如：`📰 {{title}}\n\n{{link}}`
4. 設定發送時段（建議避開凌晨）

### 方案 B：Zapier / Make（最彈性，免費額度夠小站）
1. 到 [zapier.com](https://zapier.com) 建立 Zap
2. **Trigger**：`RSS by Zapier` → `New Item in Feed` → 貼上 RSS 網址
3. **Action**：`Twitter / X`、`LinkedIn`、`Telegram` 等 → `Create Post`
4. 貼文內容用欄位變數：`{{Title}} {{Link}}`
5. 可串多個 Action，一次發到多平台

### 方案 C：IFTTT（免費，單平台）
1. [ifttt.com](https://ifttt.com) → Create Applet
2. **If**：RSS Feed → New feed item
3. **Then**：Twitter → Post a tweet

---

## 三、進階：AI 自動改寫多平台貼文（可選）

不同平台需要不同語氣（X 短、LinkedIn 專業）。可用 Zapier/Make 串 Claude API：

1. Trigger：RSS 新文章
2. Action：呼叫 Claude API（`claude-opus-4-8`），prompt 例如
   「把以下文章摘要改寫成一則 3 段的 X thread，口語、附 emoji：{{content}}」
3. Action：把回傳文字發到 X

> 這步驟需要 Anthropic API key，屬進階選項，起步階段可先跳過。

---

## 建議的起步組合（30 分鐘設定）

1. **Substack** 開帳號 → 開 RSS import → 填 `NEXT_PUBLIC_NEWSLETTER_ACTION_URL`
2. **Buffer** 免費版 → 連 X + LinkedIn → 接 RSS 自動發文
3. 之後每次只要寫文章、部署，電子報與社群貼文都會自動送出

## 驗證

- 瀏覽器開 `https://你的網域/api/rss?locale=zh`，應看到含完整內容的 XML
- 用 [validator.w3.org/feed](https://validator.w3.org/feed/) 貼上網址驗證 feed 格式正確
- 在 Substack/Buffer 後台按「測試」確認能抓到最新文章
