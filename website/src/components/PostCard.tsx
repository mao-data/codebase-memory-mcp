import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Post } from '@/lib/posts';

export default function PostCard({
  post,
  locale,
  size = 'default',
}: {
  post: Post;
  locale: string;
  size?: 'default' | 'compact';
}) {
  const t = useTranslations('article');
  const compact = size === 'compact';

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 transition-all hover:-translate-y-1 hover:border-accent/60 dark:hover:border-accent/60 hover:shadow-lg">
      <div className={`${compact ? 'p-4' : 'p-5'} flex flex-col flex-1`}>
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/${locale}/category/${post.category}`} className="text-xs font-semibold uppercase tracking-wide text-accent dark:text-accent-light hover:underline">
            {post.category}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime} {t('reading_time')}</span>
        </div>
        <Link href={`/${locale}/blog/${post.slug}`}>
          <h2 className={`font-display font-bold ${compact ? 'text-base' : 'text-lg'} text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent-light transition-colors line-clamp-2 mb-2`}>
            {post.title}
          </h2>
        </Link>
        {!compact && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">{post.excerpt}</p>
        )}
        <div className={`${compact ? 'mt-auto pt-2' : 'mt-4'} flex items-center justify-between`}>
          <time className="text-xs text-gray-400">{post.date}</time>
          {!compact && (
            <div className="flex gap-1 flex-wrap justify-end">
              {post.tags.slice(0, 2).map((tag) => (
                <Link key={tag} href={`/${locale}/tag/${tag}`} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
