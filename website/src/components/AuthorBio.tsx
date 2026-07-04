import { getTranslations } from 'next-intl/server';
import { AUTHOR } from '@/lib/author';
import type { Locale } from '@/lib/posts';

export default async function AuthorBio({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const lang = locale === 'zh' ? 'zh' : 'en';
  const initial = AUTHOR.name[lang].charAt(0);

  const links = [
    AUTHOR.twitter && { label: 'X', href: AUTHOR.twitter },
    AUTHOR.linkedin && { label: 'LinkedIn', href: AUTHOR.linkedin },
    AUTHOR.email && { label: 'Email', href: `mailto:${AUTHOR.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className="mt-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
      <h2 className="sr-only">{t('article.about_author')}</h2>
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-xl font-bold">
          {initial}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{AUTHOR.name[lang]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{AUTHOR.role[lang]}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{AUTHOR.bio[lang]}</p>
          {links.length > 0 && (
            <div className="mt-3 flex gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-sm text-accent dark:text-accent-light hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
