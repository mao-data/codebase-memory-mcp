import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import readingTime from 'reading-time';

export type Locale = 'zh' | 'en';

export interface Post {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: string;
  content?: string;
}

const postsDir = path.join(process.cwd(), '_posts');

export function getPostSlugs(locale: Locale): string[] {
  const dir = path.join(postsDir, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string, locale: Locale): Post | null {
  const fullPath = path.join(postsDir, locale, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    locale,
    title: data.title ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    category: data.category ?? '',
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    readingTime: Math.ceil(rt.minutes).toString(),
    content,
  };
}

export async function getPostHtml(slug: string, locale: Locale): Promise<string> {
  const post = getPostBySlug(slug, locale);
  if (!post?.content) return '';
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(post.content);
  return result.toString();
}

export function getAllPosts(locale: Locale): Post[] {
  return getPostSlugs(locale)
    .map((slug) => getPostBySlug(slug, locale))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostsByCategory(category: string, locale: Locale): Post[] {
  return getAllPosts(locale).filter((p) => p.category === category);
}

export function getPostsByTag(tag: string, locale: Locale): Post[] {
  return getAllPosts(locale).filter((p) => p.tags.includes(tag));
}

export function getAllCategories(locale: Locale): string[] {
  return Array.from(new Set(getAllPosts(locale).map((p) => p.category)));
}

export function getAllTags(locale: Locale): string[] {
  const tags = getAllPosts(locale).flatMap((p) => p.tags);
  return Array.from(new Set(tags));
}
