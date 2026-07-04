'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
}

export default function SearchBar({ locale }: { locale: string }) {
  const t = useTranslations('search');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && index.length === 0) {
      fetch(`/api/search-index?locale=${locale}`)
        .then((r) => r.json())
        .then((data) => setIndex(data));
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, locale, index.length]);

  useEffect(() => {
    if (!query || index.length === 0) { setResults([]); return; }
    const fuse = new Fuse(index, { keys: ['title', 'excerpt', 'tags'], threshold: 0.4 });
    setResults(fuse.search(query).slice(0, 6).map((r) => r.item));
  }, [query, index]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label={t('title')}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={`/${locale}/blog/${r.slug}`} onClick={() => setOpen(false)} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{r.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{r.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query && results.length === 0 && (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">{t('no_results')}</p>
        )}
      </div>
    </div>
  );
}
