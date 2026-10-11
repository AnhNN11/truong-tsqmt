import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, HeartHandshake, ShieldCheck } from 'lucide-react';
import { schoolMedia } from '@/lib/school-media';
import type { Settings } from '@/lib/types';
import styles from './school-story.module.css';
import { HomeSectionGraphics } from './home-graphics';

const values = [
  { icon: BookOpen, label: 'Vững nền tảng tri thức' },
  { icon: ShieldCheck, label: 'Rèn ý chí, luyện bản lĩnh' },
  { icon: HeartHandshake, label: 'Nuôi dưỡng lòng nhân ái' },
  { icon: Compass, label: 'Khơi dậy khát vọng' },
];

export function SchoolStory({ settings }: { settings: Settings }) {
  return (
    <section
      id="ve-nha-truong"
      className={`school-story-section ${styles.section}`}
      aria-labelledby="school-story-title"
    >
      <HomeSectionGraphics scene="story" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <span className="eyebrow"><span />VỀ NHÀ TRƯỜNG</span>
            <h2 id="school-story-title" className={styles.title}>{settings.introTitle}</h2>
            <p className={styles.description}>{settings.introText}</p>
            <Link href="/gioi-thieu" className={styles.storyLink}>
              Câu chuyện về nhà trường <ArrowUpRight size={19} />
            </Link>

            <aside className={styles.note}>
              <img src="/images/school-logo.jpg" alt="" width={44} height={44} loading="lazy" />
              <div>
                <strong>MỘT MÁI TRƯỜNG · NHIỀU ĐIỂM TỰA</strong>
                <p>Học viên được lớn lên trong một tập thể có kỷ cương, tình thương và những người luôn đồng hành.</p>
              </div>
            </aside>
          </div>

          <figure className={styles.video}>
            <div className={styles.videoFrame}>
              <video
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
          </figure>
        </div>

        <ul className={styles.values} aria-label="Những giá trị nhà trường">
          {values.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
