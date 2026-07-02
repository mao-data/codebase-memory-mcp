'use client';

import { useTranslations } from 'next-intl';

interface Tool {
  name: string;
  desc: { zh: string; en: string };
  url: string;
}

// Affiliate links are placeholders — replace `url` with your real referral links.
// Grouped by article category so each post shows the most relevant tools.
const TOOLS_BY_CATEGORY: Record<string, Tool[]> = {
  models: [
    { name: 'Claude', desc: { zh: 'Anthropic 旗艦模型，程式與長文推理首選', en: 'Anthropic flagship model for coding and reasoning' }, url: '#' },
    { name: 'Cursor', desc: { zh: 'AI 原生程式編輯器', en: 'AI-native code editor' }, url: '#' },
    { name: 'Perplexity', desc: { zh: 'AI 搜尋與研究助手', en: 'AI search and research assistant' }, url: '#' },
  ],
  medical: [
    { name: 'ChatGPT Plus', desc: { zh: '通用 AI 助手，醫療文獻摘要好用', en: 'General AI assistant, great for literature review' }, url: '#' },
    { name: 'Elicit', desc: { zh: 'AI 學術文獻研究工具', en: 'AI research assistant for papers' }, url: '#' },
    { name: 'Consensus', desc: { zh: '以研究證據回答問題的 AI', en: 'Evidence-based AI answer engine' }, url: '#' },
  ],
  travel: [
    { name: 'ChatGPT Plus', desc: { zh: '行程規劃與翻譯全能助手', en: 'Trip planning and translation assistant' }, url: '#' },
    { name: 'Gemini', desc: { zh: 'Google AI，整合地圖與旅遊搜尋', en: 'Google AI with Maps and travel search' }, url: '#' },
    { name: 'Wanderlog', desc: { zh: 'AI 行程規劃工具', en: 'AI-powered trip planner' }, url: '#' },
  ],
};

export default function ToolRecommendations({ category, locale }: { category: string; locale: string }) {
  const t = useTranslations('tools');
  const tools = TOOLS_BY_CATEGORY[category];
  if (!tools) return null;
  const lang = locale === 'zh' ? 'zh' : 'en';

  return (
    <aside className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('title')}</h3>
      <ul className="mt-4 space-y-3">
        {tools.map((tool) => (
          <li key={tool.name} className="flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">{tool.name}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tool.desc[lang]}</p>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {t('visit')}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">{t('disclosure')}</p>
    </aside>
  );
}
