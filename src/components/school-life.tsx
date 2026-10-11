'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, HeartHandshake, Maximize2, Monitor, ShieldCheck, Star, UsersRound, X } from 'lucide-react';
import styles from './school-life.module.css';
import facultyStyles from './faculty-directory.module.css';
import disciplineStyles from './school-discipline.module.css';
import { faculties } from '@/lib/faculties';
import { HomeSectionGraphics } from './home-graphics';

type Photo = { src: string; title: string; description: string };
const learning: Photo[] = [
  { src: '/images/learning-classroom-03.png', title: 'Không gian học tập hiện đại', description: 'Giáo viên hướng dẫn học viên trong giờ học tại lớp.' },
  { src: '/images/activity-campus-briefing.jpg', title: 'Hoạt động ngoại khóa', description: 'Học viên tham gia hoạt động tập thể trong khuôn viên nhà trường.' },
  { src: '/images/learning-classroom-04.png', title: 'Thực hành cùng công nghệ', description: 'Giáo viên hướng dẫn học viên thực hành trong phòng máy tính.' },
  { src: '/images/learning-classroom-02.png', title: 'Thầy cô đồng hành', description: 'Tập thể học viên tập trung theo dõi bài học.' },
];
const discipline: Photo[] = [
  { src: '/images/discipline-study.png', title: 'Tự giác trong học tập', description: 'Học viên đọc sách trong giờ tự học tại phòng ở.' },
  { src: '/images/discipline-drill.png', title: 'Rèn từng động tác', description: 'Cán bộ hướng dẫn học viên thực hiện động tác trong giờ rèn luyện.' },
  { src: '/images/discipline-bed-folding.png', title: 'Chỉn chu từ việc nhỏ', description: 'Học viên tự gấp và chỉnh chăn màn tại phòng ở.' },
];
const photos = [...learning, ...discipline];
const values = [
  { icon: BookOpen, title: 'Bồi đắp tri thức', text: 'Khơi dậy niềm say mê học tập và tinh thần tự học.' },
  { icon: ShieldCheck, title: 'Rèn luyện bản lĩnh', text: 'Bền bỉ, tự giác và có trách nhiệm với bản thân.' },
  { icon: Star, title: 'Phát triển toàn diện', text: 'Cân bằng kiến thức, thể chất và kỹ năng sống.' },
  { icon: UsersRound, title: 'Hành trình cùng bạn', text: 'Lắng nghe, sẻ chia và cùng nhau tiến bộ.' },
];

export function SchoolLife() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const active = selected !== null ? photos[selected] : null;
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    if (modal && !modal.open) modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
    };
  }, [isOpen]); // Keep the dialog open while navigating between photos.

  function close() {
    setSelected(null);
    opener.current?.focus();
  }

  function photoButton(photo: Photo, index: number, className = '') {
    return <button key={photo.src} className={`${styles.photo} ${className}`} type="button" aria-label={`Xem ảnh: ${photo.title}`} onClick={event => { opener.current = event.currentTarget; setSelected(index); }}>
      <img src={photo.src} alt={photo.description} width={index === 4 || index === 7 ? 960 : 1280} height={index === 4 || index === 7 ? 1280 : 960} />
      <span className={styles.caption}><span>{photo.title}</span><Maximize2 size={16} aria-hidden="true" /></span>
    </button>;
  }

  return <div id="school-life" className={styles.schoolLife}>
    <section id="gia-tri-cot-loi" className={styles.core} aria-labelledby="core-title">
      <HomeSectionGraphics scene="core" />
      <div className={`${styles.inner} ${styles.coreLayout}`}>
        <div className={styles.coreHeading}>
          <div className={styles.kicker}><span>01</span> GIÁ TRỊ CỐT LÕI</div>
          <h2 id="core-title">Hành trang cho<br />một tương lai<br /><em>vững vàng.</em></h2>
          <p>Tri thức, bản lĩnh và tình yêu thương cùng các em viết nên hành trình trưởng thành.</p>
          <Link href="/giao-duc" className={styles.coreLink}>Khám phá giáo dục & rèn luyện <ArrowRight size={18} /></Link>
        </div>
        <div className={styles.coreGrid}>{values.map(({ icon: Icon, title, text }, index) => <Link href="/giao-duc" className={styles.value} key={title}>
          <div className={styles.valueTop}><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div>
          <h3>{title}</h3><p>{text}</p><span className={styles.valueLink}>Tìm hiểu thêm <ArrowRight size={15} /></span>
        </Link>)}</div>
      </div>
    </section>

    <section id="cac-khoa" className={facultyStyles.section} aria-labelledby="faculties-title">
      <HomeSectionGraphics scene="faculties" />
      <div className={facultyStyles.inner}>
        <div className={facultyStyles.heading}>
          <div>
            <span className={facultyStyles.eyebrow}>BỐN KHOA ĐÀO TẠO</span>
            <h2 id="faculties-title">Mỗi khoa mở một hướng đi.</h2>
          </div>
          <Link className={facultyStyles.overview} href="/giao-duc">Xem toàn bộ chương trình <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <ol className={facultyStyles.list}>
          {faculties.map(({ slug, number, title, summary, icon: Icon }) => <li key={slug}>
            <Link className={facultyStyles.card} href={`/giao-duc/${slug}`}>
              <div className={facultyStyles.content}>
                <span className={facultyStyles.mark}><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><span>{number}</span></span>
                <h3 className={facultyStyles.title}>{title}</h3>
                <p className={facultyStyles.summary}>{summary}</p>
                <span className={facultyStyles.action}>Khám phá khoa <ArrowRight size={17} aria-hidden="true" /></span>
              </div>
            </Link>
          </li>)}
        </ol>
      </div>
    </section>

    <section id="moi-truong-hoc-tap" className={styles.learning} aria-labelledby="learning-title">
      <HomeSectionGraphics scene="learning" />
      <div className={`${styles.inner} ${styles.learningLayout}`}>
        <div className={styles.copy}>
          <div className={styles.kicker}><span>02</span> MÔI TRƯỜNG HỌC TẬP</div>
          <h2 id="learning-title">Học điều mới.<br />Mở lối <em>tương lai.</em></h2>
          <p>Từ giờ học trên lớp đến thực hành trong phòng máy, mỗi trải nghiệm giúp học viên tự tin khám phá, chủ động học hỏi và phát triển từng ngày.</p>
          <ul className={styles.points}>
            <li><BookOpen size={21} />Học tập chủ động, nuôi dưỡng đam mê</li>
            <li><HeartHandshake size={21} />Thầy cô tận tâm, bạn bè gắn kết</li>
            <li><Monitor size={21} />Khám phá kiến thức qua thực hành</li>
          </ul>
          <Link href="/giao-duc" className={styles.cta}>Khám phá môi trường học tập <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.learningGallery}>{learning.map((photo, index) => photoButton(photo, index, index === 0 ? styles.learningLead : ''))}</div>
      </div>
    </section>

    <section id="nen-nep" className={disciplineStyles.section} aria-labelledby="discipline-title">
      <HomeSectionGraphics scene="discipline" />
      <div className={disciplineStyles.inner}>
        <div className={disciplineStyles.layout}>
          <div className={disciplineStyles.copy}>
            <div className={disciplineStyles.kicker}><span>03</span> NỀN NẾP · TÁC PHONG</div>
            <h2 id="discipline-title">Nền nếp tạo nên<br /><em>sự tự tin.</em></h2>
            <p className={disciplineStyles.intro}>Từ một trang sách, một nếp chăn đến từng động tác trên sân tập. Những việc nhỏ được làm tốt mỗi ngày là nền tảng để học viên tự lập và trưởng thành.</p>
            <ul className={disciplineStyles.points}>
              <li><ShieldCheck size={21} strokeWidth={1.5} aria-hidden="true" /><span>Tự giác trong học tập và sinh hoạt</span></li>
              <li><Star size={21} strokeWidth={1.5} aria-hidden="true" /><span>Ngăn nắp, chỉn chu từ những việc nhỏ</span></li>
              <li><UsersRound size={21} strokeWidth={1.5} aria-hidden="true" /><span>Rèn luyện cùng sự hướng dẫn tận tâm</span></li>
            </ul>
            <Link href="/giao-duc" className={styles.cta}>Tìm hiểu giáo dục & rèn luyện <ArrowRight size={17} aria-hidden="true" /></Link>
            <p className={disciplineStyles.signature}><span>Mỗi ngày tiến bộ.</span>{' '}<span>Mỗi ngày trưởng thành.</span></p>
          </div>
          <div className={disciplineStyles.visual}>
            <div className={disciplineStyles.gallery}>
              {photoButton(discipline[0], 4, `${disciplineStyles.photo} ${disciplineStyles.study}`)}
              {photoButton(discipline[1], 5, `${disciplineStyles.photo} ${disciplineStyles.drill}`)}
              {photoButton(discipline[2], 6, `${disciplineStyles.photo} ${disciplineStyles.bed}`)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <dialog ref={dialog} className={styles.viewer} aria-label="Ảnh hoạt động nhà trường" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setSelected(index => index === null ? null : (index + 1) % photos.length); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSelected(index => index === null ? null : (index - 1 + photos.length) % photos.length); }
    }}>
      {active && <div className={styles.viewerContent}>
        <button className={styles.close} onClick={close} aria-label="Đóng ảnh" autoFocus><X size={24} /></button>
        <img className={styles.fullPhoto} src={active.src} alt={active.description} />
        <div className={styles.viewerFooter}>
          <button onClick={() => setSelected(index => index === null ? null : (index - 1 + photos.length) % photos.length)} aria-label="Ảnh trước"><ChevronLeft /></button>
          <div aria-live="polite"><strong>{active.title}</strong><span>{(selected ?? 0) + 1} / {photos.length}</span></div>
          <button onClick={() => setSelected(index => index === null ? null : (index + 1) % photos.length)} aria-label="Ảnh tiếp theo"><ChevronRight /></button>
        </div>
      </div>}
    </dialog>
  </div>;
}
