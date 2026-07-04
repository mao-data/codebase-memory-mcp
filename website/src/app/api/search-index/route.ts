import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/posts';

export const dynamic = 'force-static';

export function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'zh') as Locale;
  const posts = getAllPosts(locale).map(({ slug, title, excerpt, category, tags }) => ({
    slug,
    title,
    excerpt,
    category,
    tags,
  }));
  return NextResponse.json(posts);
}
