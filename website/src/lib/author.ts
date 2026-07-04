/**
 * Site author / publisher identity — used for bylines, the About page, and
 * JSON-LD structured data (E-E-A-T signals for SEO and AI search).
 *
 * Fill in real details as the site grows: a named human author with verifiable
 * credentials and social links strengthens Experience/Expertise/Authoritativeness.
 */
export const AUTHOR = {
  name: { zh: '編輯部', en: 'Editorial Team' },
  role: { zh: 'AI 觀察編輯團隊', en: 'AI Observer Editorial Team' },
  bio: {
    zh: '我們是一群關注人工智慧發展的研究者與工程師，專注追蹤 AI 模型、醫療 AI 與旅遊科技的最新突破，並以中英雙語提供經過查證、有脈絡的深度分析。',
    en: 'We are researchers and engineers tracking the frontier of AI — covering models, medical AI, and travel technology with verified, contextual analysis in both Chinese and English.',
  },
  // Optional public profiles — leave empty to hide. Fill in to boost E-E-A-T.
  twitter: '', // e.g. 'https://x.com/yourhandle'
  linkedin: '', // e.g. 'https://www.linkedin.com/in/yourprofile'
  email: '', // e.g. 'hello@your-domain.com'
};

export type AuthorLocale = 'zh' | 'en';
