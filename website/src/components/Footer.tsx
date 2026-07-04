import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations();
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {t('site.name')} · {t('footer.rights')}
        </p>
        <div className="flex items-center gap-4">
          <Link href={`/api/rss?locale=${locale}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            {t('footer.rss')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
