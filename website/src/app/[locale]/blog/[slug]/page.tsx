import { getTranslations } from 'next-intl/server';
import { getPostBySlug, getPostHtml, getAllPosts } from '@/lib/posts';
import type { Locale } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import GiscusComments from '@/components/GiscusComments';

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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <Link href={`/${locale}/category/${post.category}`} className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {post.category}
        </Link>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{t('article.published')} <time>{post.date}</time></span>
          <span>·</span>
          <span>{post.readingTime} {t('article.reading_time')}</span>
          <span>·</span>
          <Link href={`/${altLocale}/blog/${slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">{altLabel}</Link>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${locale}/tag/${tag}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                # {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <article
        className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Comments */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-4">{t('article.comments')}</h2>
        <GiscusComments />
      </section>
    </div>
  );
}
