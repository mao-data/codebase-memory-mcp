import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/posts';

export function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'zh') as Locale;
  const posts = getAllPosts(locale).slice(0, 20);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-observer.vercel.app';
  const title = locale === 'zh' ? 'AI 觀察' : 'AI Observer';

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/${locale}/blog/${p.slug}</link>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/${locale}/blog/${p.slug}</guid>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}/${locale}</link>
    <description>${locale === 'zh' ? '深度追蹤 AI 最前線' : 'In-depth AI coverage'}</description>
    <language>${locale === 'zh' ? 'zh-TW' : 'en'}</language>
    <atom:link href="${baseUrl}/api/rss?locale=${locale}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
