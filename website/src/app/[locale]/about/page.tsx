import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AUTHOR } from '@/lib/author';

type Params = Promise<{ locale: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-observer.vercel.app';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('about.title'),
    description: t('about.intro'),
    alternates: { canonical: `${SITE_URL}/${locale}/about` },
  };
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const lang = locale === 'zh' ? 'zh' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('about.title'),
    url: `${SITE_URL}/${locale}/about`,
    inLanguage: locale === 'zh' ? 'zh-TW' : 'en',
    publisher: { '@type': 'Organization', name: t('site.name'), url: SITE_URL },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{t('about.title')}</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{t('about.intro')}</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.mission_title')}</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{t('about.mission')}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.coverage_title')}</h2>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li>{t('about.coverage_models')}</li>
            <li>{t('about.coverage_medical')}</li>
            <li>{t('about.coverage_travel')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.standards_title')}</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{t('about.standards')}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.author_title')}</h2>
          <div className="mt-3 flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
              {AUTHOR.name[lang].charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{AUTHOR.name[lang]}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{AUTHOR.role[lang]}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{AUTHOR.bio[lang]}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.contact_title')}</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{t('about.contact')}</p>
        </section>
      </div>
    </div>
  );
}
