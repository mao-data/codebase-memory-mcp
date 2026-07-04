import { getTranslations } from 'next-intl/server';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import type { Locale } from '@/lib/posts';
import Link from 'next/link';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const posts = getAllPosts(locale as Locale);
  const featured = posts[0];
  const side = posts.slice(1, 3);
  const rest = posts.slice(3, 9);

  const categories = [
    { slug: 'models', label: t('categories.models') },
    { slug: 'medical', label: t('categories.medical') },
    { slug: 'travel', label: t('categories.travel') },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-gray-900 dark:text-white text-balance">
          {t('home.hero_title')}
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('home.hero_subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/category/${c.slug}`}
              className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:border-accent hover:text-accent dark:hover:text-accent-light transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Bento: featured (2x2) + two compact side cards */}
      {featured && (
        <section className="mb-12 grid gap-6 lg:grid-cols-3">
          <Link href={`/${locale}/blog/${featured.slug}`} className="lg:col-span-2 group">
            <div className="h-full flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-10 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-gray-800 dark:to-gray-800 transition-all group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent dark:text-accent-light">{featured.category}</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl">{featured.excerpt}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <time>{featured.date}</time>
                <span>·</span>
                <span>{featured.readingTime} {t('article.reading_time')}</span>
              </div>
            </div>
          </Link>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
            {side.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} size="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Recent articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t('home.latest')}</h2>
          <Link href={`/${locale}/category/models`} className="text-sm text-accent dark:text-accent-light hover:underline">{t('home.view_all')}</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mt-16">
        <NewsletterForm variant="block" />
      </section>
    </div>
  );
}
