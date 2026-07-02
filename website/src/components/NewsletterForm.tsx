'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Zero-backend newsletter form.
 * Set NEXT_PUBLIC_NEWSLETTER_ACTION_URL to a Substack / ConvertKit / Mailchimp
 * form endpoint. The form submits natively (target="_blank"), so no server is
 * needed; the provider handles the double opt-in confirmation email.
 * If the env var is unset, the form still renders and shows the success state
 * for local preview.
 */
export default function NewsletterForm({ variant = 'block' }: { variant?: 'block' | 'inline' }) {
  const t = useTranslations('newsletter');
  const [submitted, setSubmitted] = useState(false);
  const action = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION_URL || '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!action) e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className={
        variant === 'block'
          ? 'rounded-2xl border border-blue-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 p-8 text-center'
          : 'rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6'
      }
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('title')}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">{t('subtitle')}</p>
      {submitted ? (
        <p className="mt-5 text-sm font-semibold text-green-600 dark:text-green-400">{t('success')}</p>
      ) : (
        <form
          action={action || undefined}
          method="post"
          target={action ? '_blank' : undefined}
          onSubmit={handleSubmit}
          className="mt-5 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            required
            placeholder={t('placeholder')}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            {t('button')}
          </button>
        </form>
      )}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{t('privacy')}</p>
    </div>
  );
}
