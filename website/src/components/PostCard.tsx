import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Post } from '@/lib/posts';

export default function PostCard({ post, locale }: { post: Post; locale: string }) {
  const t = useTranslations('article');
  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/${locale}/category/${post.category}`} className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 hover:underline">
            {post.category}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime} {t('reading_time')}</span>
        </div>
        <Link href={`/${locale}/blog/${post.slug}`}>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <time className="text-xs text-gray-400">{post.date}</time>
          <div className="flex gap-1 flex-wrap justify-end">
            {post.tags.slice(0, 2).map((tag) => (
              <Link key={tag} href={`/${locale}/tag/${tag}`} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
