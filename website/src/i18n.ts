import { getRequestConfig } from 'next-intl/server';

const locales = ['zh', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || 'zh';
  const validLocale = locales.includes(locale) ? locale : 'zh';
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
