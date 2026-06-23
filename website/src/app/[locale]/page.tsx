import { getTranslations } from 'next-intl/server';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import type { Locale } from '@/lib/posts';
import Link from 'next/link';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const posts = getAllPosts(locale as Locale);
  const featured = posts.slice(0, 1)[0];
  const recent = posts.slice(1, 7);

  const categories = [
    { slug: 'models', label: t('categories.models'), color: 'bg-blue-500' },
    { slug: 'medical', label: t('categories.medical'), color: 'bg-green-500' },
    { slug: 'travel', label: t('categories.travel'), color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          {t('home.hero_title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('home.hero_subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/${locale}/category/${c.slug}`} className={`px-5 py-2 rounded-full text-white text-sm font-semibold ${c.color} hover:opacity-90 transition-opacity`}>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="mb-12">
          <Link href={`/${locale}/blog/${featured.slug}`}>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 hover:shadow-xl transition-shadow">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{featured.category}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{featured.title}</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-3xl">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <time>{featured.date}</time>
                <span>·</span>
                <span>{featured.readingTime} {t('article.reading_time')}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.latest')}</h2>
          <Link href={`/${locale}/category/models`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t('home.view_all')}</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
