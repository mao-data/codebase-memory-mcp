import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import { Fraunces, Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

// Editorial type system: Fraunces (latin display serif) with Noto Serif TC as
// the CJK display fallback; Noto Sans TC covers body text in both languages.
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const notoSerifTC = Noto_Serif_TC({ weight: ['600', '700', '900'], subsets: ['latin'], variable: '--font-display-tc', display: 'swap' });
const notoSansTC = Noto_Sans_TC({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-sans-body', display: 'swap' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-observer.vercel.app';
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('name'), template: `%s | ${t('name')}` },
    description: t('description'),
    openGraph: {
      siteName: t('name'),
      locale: locale === 'zh' ? 'zh_TW' : 'en_US',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale === 'zh' ? 'zh-TW' : 'en'} suppressHydrationWarning>
      <body className={`${fraunces.variable} ${notoSerifTC.variable} ${notoSansTC.variable} font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
