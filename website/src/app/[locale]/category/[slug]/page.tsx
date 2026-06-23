import { getTranslations } from 'next-intl/server';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import type { Locale } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} | Category` };
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ['zh', 'en'] as Locale[]) {
    getAllCategories(locale).forEach((cat) => params.push({ locale, slug: cat }));
  }
  return params;
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const posts = getPostsByCategory(slug, locale as Locale);
  if (posts.length === 0) notFound();

  const categoryLabel = t(`categories.${slug}` as Parameters<typeof t>[0]) ?? slug;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">{categoryLabel}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{posts.length} {t('search.results')}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
