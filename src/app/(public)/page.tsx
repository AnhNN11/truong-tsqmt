import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPosts, getSettings, getHeroSlides } from '@/lib/db';
import { dateLabel } from '@/lib/utils';
import { HeroCarousel } from '@/components/hero-carousel';
import { SectionTitle, PostCard } from '@/components/public-ui';
import { ContactSection } from '@/components/contact-section';
import { PressStrip } from '@/components/press-strip';
import { SchoolLife } from '@/components/school-life';
import { SchoolStory } from '@/components/school-story';
import { HomeGraphics, HomeSectionGraphics } from '@/components/home-graphics';
import newsStyles from './home-news.module.css';

export default function Home() {
  const s = getSettings();
  const posts = getPosts();
  const lead = posts[0];

  return <>
    <HeroCarousel settings={s} slides={getHeroSlides()} />

    <HomeGraphics>
    <section id="tin-tuc" className="news-section section" aria-label="Tin tức và sự kiện">
      <HomeSectionGraphics scene="news" />
      <div className="container">
        <SectionTitle eyebrow="NHỊP SỐNG NHÀ TRƯỜNG" title="Tin tức & sự kiện" href="/tin-tuc" />
        <div className="home-news-grid">
          {lead && <PostCard post={lead} large />}
          <div className={`news-stack ${newsStyles.scrollList}`} tabIndex={0} role="region" aria-label="Các bài viết khác — cuộn để xem thêm">
            {posts.slice(1).map(post => <article className="compact-post" key={post.id}>
              <Link href={`/tin-tuc/${post.slug}`}><img src={post.cover || '/images/campus.webp'} alt={post.title} loading="lazy" /></Link>
              <div>
                <span className="small-meta">{dateLabel(post.published_at || post.created_at)}</span>
                <h3><Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link></h3>
                <Link className="read-more" href={`/tin-tuc/${post.slug}`}>Đọc tiếp <ArrowRight size={14} /></Link>
              </div>
            </article>)}
          </div>
        </div>
      </div>
    </section>

    <PressStrip />

    <SchoolStory settings={s} />

    <SchoolLife />

    <ContactSection settings={s} />
    </HomeGraphics>
  </>;
}
