import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostHtml } from '@/lib/posts';
import type { Locale } from '@/lib/posts';

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'zh') as Locale;
  const posts = getAllPosts(locale).slice(0, 20);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-observer.vercel.app';
  const title = locale === 'zh' ? 'AI 觀察' : 'AI Observer';
  const description = locale === 'zh' ? '深度追蹤 AI 最前線' : 'In-depth AI coverage';

  const items = (
    await Promise.all(
      posts.map(async (p) => {
        const url = `${baseUrl}/${locale}/blog/${p.slug}`;
        const contentHtml = await getPostHtml(p.slug, locale);
        const categories = [p.category, ...p.tags]
          .map((c) => `<category><![CDATA[${c}]]></category>`)
          .join('');
        return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${url}</link>
      <description><![CDATA[${p.excerpt}]]></description>
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
      ${categories}
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`;
      })
    )
  ).join('');

  const lastBuildDate = posts.length ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}/${locale}</link>
    <description>${description}</description>
    <language>${locale === 'zh' ? 'zh-TW' : 'en'}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss?locale=${locale}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
