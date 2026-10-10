import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();
  const staticRoutes = ['', '/gioi-thieu', '/giao-duc', '/tuyen-sinh', '/tin-tuc'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' as const : 'daily' as const,
    priority: path === '' ? 1 : 0.7,
  }));
  const postRoutes = getPosts().map((post) => ({
    url: `${baseUrl}/tin-tuc/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || post.created_at),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.8 : 0.6,
  }));
  return [...staticRoutes, ...postRoutes];
}
