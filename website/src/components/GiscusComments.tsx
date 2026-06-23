'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function GiscusComments({ repo = 'owner/repo' }: { repo?: string }) {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('iframe')) return;
    const [repoOwner, repoName] = repo.split('/');
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-TW');
    script.crossOrigin = 'anonymous';
    script.async = true;
    void repoOwner; void repoName;
    ref.current.appendChild(script);
  }, [repo, resolvedTheme]);

  return <div ref={ref} className="mt-12" />;
}
