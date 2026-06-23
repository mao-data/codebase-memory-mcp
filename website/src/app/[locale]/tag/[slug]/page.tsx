import { getTranslations } from 'next-intl/server';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import type { Locale } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ['zh', 'en'] as Locale[]) {
    getAllTags(locale).forEach((tag) => params.push({ locale, slug: tag }));
  }
  return params;
}

export default async function TagPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const posts = getPostsByTag(slug, locale as Locale);
  if (posts.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white"># {slug}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{posts.length} {t('search.results')}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
