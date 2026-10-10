import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import { getPosts, getSettings, getHeroSlides } from '@/lib/db';
import { dateLabel } from '@/lib/utils';
import { HeroCarousel } from '@/components/hero-carousel';
import { SectionTitle, PostCard } from '@/components/public-ui';
import { ContactSection } from '@/components/contact-section';
import { PressStrip } from '@/components/press-strip';
import { SchoolLife } from '@/components/school-life';
import { schoolMedia } from '@/lib/school-media';
import { LandingArt } from '@/components/landing-art';

export default function Home() {
  const s = getSettings();
  const posts = getPosts();
  const lead = posts[0];

  return <>
    <HeroCarousel settings={s} slides={getHeroSlides()} />

    <section id="tin-tuc" className="news-section section" aria-label="Tin tức và sự kiện">
      <LandingArt kind="drum-seal" className="news-section-art" />
      <div className="container">
        <SectionTitle eyebrow="NHỊP SỐNG NHÀ TRƯỜNG" title="Tin tức & sự kiện" href="/tin-tuc" />
        <div className="home-news-grid">
          {lead && <PostCard post={lead} large />}
          <div className="news-stack">
            {posts.slice(1, 4).map(post => <article className="compact-post" key={post.id}>
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

    <section id="ve-nha-truong" className="section school-story-section" aria-labelledby="school-story-title">
      <LandingArt kind="mountain-pines" className="school-story-section-art" />
      <div className="container">
        <div className="school-story-layout">
          <aside className="school-story-side school-story-side-left">
            <span className="eyebrow"><span />VỀ NHÀ TRƯỜNG</span>
            <h2 id="school-story-title">{s.introTitle}</h2>
            <p>{s.introText}</p>
            <div className="school-story-values">
              <div><BookOpen size={19} /><span>Vững nền tảng tri thức</span></div>
              <div><ShieldCheck size={19} /><span>Rèn ý chí, luyện bản lĩnh</span></div>
              <div><HeartHandshake size={19} /><span>Nuôi dưỡng lòng nhân ái</span></div>
              <div><Compass size={19} /><span>Khơi dậy khát vọng</span></div>
            </div>
            <Link href="/gioi-thieu" className="text-link">Câu chuyện về nhà trường <ArrowUpRight size={18} /></Link>
          </aside>

          <div className="school-story-video">
            <div className="intro-video-frame">
              <video
                className="school-story-video-player"
                title="Video giới thiệu Phân hiệu 1 Trường Thiếu sinh quân miền Trung"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/school-ceremony.jpg"
              >
                <source src={schoolMedia.localVideo} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>
            </div>
            <div className="intro-video-meta"><span>Video giới thiệu Phân hiệu 1</span><span className="intro-video-live">TỰ PHÁT · ÂM THANH TẮT</span></div>
          </div>

          <aside className="school-story-side school-story-side-right">
            <LandingArt kind="academy-gate" className="school-story-gate-art" />
            <div className="school-story-note">
              <img className="school-story-note-logo" src="/images/school-logo.jpg" alt="" />
              <span className="school-story-kicker">MỘT MÁI TRƯỜNG · NHIỀU ĐIỂM TỰA</span>
              <p>Học viên được lớn lên trong một tập thể có kỷ cương, tình thương và những người luôn đồng hành.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <SchoolLife />

    <ContactSection settings={s} />
  </>;
}
