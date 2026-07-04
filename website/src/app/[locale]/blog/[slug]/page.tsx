import { getTranslations } from 'next-intl/server';
import { getPostBySlug, getPostHtml, getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import GiscusComments from '@/components/GiscusComments';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import ToolRecommendations from '@/components/ToolRecommendations';
import AuthorBio from '@/components/AuthorBio';
import { AUTHOR } from '@/lib/author';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-observer.vercel.app';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale as Locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ['zh', 'en'] as Locale[]) {
    const posts = getAllPosts(locale);
    posts.forEach((p) => params.push({ locale, slug: p.slug }));
  }
  return params;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale as Locale);
  if (!post) notFound();
  const html = await getPostHtml(slug, locale as Locale);
  const t = await getTranslations({ locale });

  const altLocale = locale === 'zh' ? 'en' : 'zh';
  const altLabel = locale === 'zh' ? 'English' : '中文';

  // Related posts: same category first, then fill with other recent posts.
  const allPosts = getAllPosts(locale as Locale);
  const related = [
    ...allPosts.filter((p) => p.slug !== slug && p.category === post.category),
    ...allPosts.filter((p) => p.slug !== slug && p.category !== post.category),
  ].slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    inLanguage: locale === 'zh' ? 'zh-TW' : 'en',
    author: { '@type': 'Organization', name: AUTHOR.name[locale === 'zh' ? 'zh' : 'en'], url: `${SITE_URL}/${locale}/about` },
    publisher: { '@type': 'Organization', name: t('site.name') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${locale}/blog/${slug}` },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href={`/${locale}`} className="hover:underline">{t('nav.home')}</Link>
        <span>›</span>
        <Link href={`/${locale}/category/${post.category}`} className="hover:underline capitalize">{post.category}</Link>
        <span>›</span>
        <span className="text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <Link href={`/${locale}/category/${post.category}`} className="text-xs font-bold uppercase tracking-widest text-accent dark:text-accent-light">
          {post.category}
        </Link>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Link href={`/${locale}/about`} className="font-medium text-gray-700 dark:text-gray-300 hover:underline">
            {t('article.by')} {AUTHOR.name[locale === 'zh' ? 'zh' : 'en']}
          </Link>
          <span>·</span>
          <span>{t('article.published')} <time>{post.date}</time></span>
          <span>·</span>
          <span>{post.readingTime} {t('article.reading_time')}</span>
          <span>·</span>
          <Link href={`/${altLocale}/blog/${slug}`} className="text-accent dark:text-accent-light hover:underline">{altLabel}</Link>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${locale}/tag/${tag}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-accent/10 dark:hover:bg-accent/20">
                # {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <article
        className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-accent dark:prose-a:text-accent-light prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Author bio (E-E-A-T) */}
      <AuthorBio locale={locale as Locale} />

      {/* Recommended tools (affiliate) */}
      <ToolRecommendations category={post.category} locale={locale} />

      {/* Newsletter */}
      <section className="mt-12">
        <NewsletterForm variant="inline" />
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('article.related')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-4">{t('article.comments')}</h2>
        <GiscusComments />
      </section>
    </div>
  );
}
