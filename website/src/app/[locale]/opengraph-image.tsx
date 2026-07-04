import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generated default social-share image, inherited by all pages under [locale]
// that don't define their own opengraph-image.
export default async function OgImage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F1117',
          color: 'white',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div style={{ width: 120, height: 8, background: '#FF4D00', borderRadius: 4, marginBottom: 40 }} />
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.02em' }}>{t('name')}</div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85, maxWidth: 900 }}>{t('description')}</div>
      </div>
    ),
    { ...size }
  );
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}
