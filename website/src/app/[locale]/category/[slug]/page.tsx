import { getTranslations } from 'next-intl/server';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import type { Locale } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Params = Promise<{ locale: string; slug: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-observer.vercel.app';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const label = t(`categories.${slug}` as Parameters<typeof t>[0]);
  const intro = t(`pillar.${slug}.intro` as Parameters<typeof t>[0]);
  return {
    title: label,
    description: intro,
    alternates: { canonical: `${SITE_URL}/${locale}/category/${slug}` },
  };
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
  const tagline = t(`pillar.${slug}.tagline` as Parameters<typeof t>[0]);
  const intro = t(`pillar.${slug}.intro` as Parameters<typeof t>[0]);

  // Subtopics = unique tags across this category's articles (internal linking).
  const subtopics = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryLabel,
    description: intro,
    url: `${SITE_URL}/${locale}/category/${slug}`,
    inLanguage: locale === 'zh' ? 'zh-TW' : 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('nav.home'), item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${SITE_URL}/${locale}/category/${slug}` },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/${locale}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:underline">{t('nav.home')}</Link>
        <span>›</span>
        <span className="text-gray-700 dark:text-gray-200">{categoryLabel}</span>
      </nav>

      {/* Pillar hero */}
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{categoryLabel}</h1>
        <p className="mt-2 text-lg font-medium text-blue-600 dark:text-blue-400">{tagline}</p>
        <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{intro}</p>
      </header>

      {/* Subtopics */}
      {subtopics.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">{t('pillar.topics_title')}</h2>
          <div className="flex flex-wrap gap-2">
            {subtopics.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/tag/${tag}`}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                # {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('pillar.articles_title')}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{posts.length} {t('search.results')}</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
