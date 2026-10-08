export type Role = 'admin' | 'editor' | 'author';
export type User = { id: string; name: string; email: string; role: Role };
export type Post = { id: string; title: string; slug: string; excerpt: string; content: string; cover: string; category: string; status: 'draft'|'pending'|'published'|'trash'; featured: number; demo: number; author_id: string; author_name?: string; created_at: string; updated_at: string; published_at: string | null; source: string; version: number };
export type Category = { id: string; name: string; slug: string };
export type Media = { id: string; name: string; url: string; mime: string; size: number; created_at: string };
export type HeroSlide = { id: string; eyebrow: string; title: string; description: string; image: string; source: string; order_index: number; active: number };
export type Settings = { schoolName: string; branch: string; tagline: string; heroTitle: string; heroDescription: string; heroImage: string; introTitle: string; introText: string; address: string; phone: string; email: string; facebook: string; recruitmentText: string; educationText: string };
