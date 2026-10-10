import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { faculties, getFaculty } from '@/lib/faculties';

export function generateStaticParams() {
  return faculties.map((faculty) => ({ slug: faculty.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const faculty = getFaculty(slug);
  return faculty ? { title: `${faculty.title} · Giáo dục & rèn luyện`, description: faculty.summary } : { title: 'Khoa đào tạo' };
}

export default async function FacultyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const faculty = getFaculty(slug);
  if (!faculty) notFound();
  const Icon = faculty.icon;
  const nextFaculty = faculties[(faculties.findIndex((item) => item.slug === faculty.slug) + 1) % faculties.length];

  return <div className={`faculty-page faculty-page-${faculty.theme}`}>
    <section className="faculty-hero">
      <img className="faculty-hero-image" src={faculty.image} alt={`${faculty.title} tại Phân hiệu 1`} />
      <div className="faculty-hero-shade" />
      <div className="container faculty-hero-inner">
        <nav className="faculty-breadcrumb" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><ChevronRight size={14}/><Link href="/giao-duc">Giáo dục & rèn luyện</Link><ChevronRight size={14}/><span>{faculty.title}</span></nav>
        <div className="faculty-hero-copy"><span className="eyebrow faculty-hero-eyebrow"><span/>{faculty.eyebrow}</span><div className="faculty-title-row"><span className="faculty-hero-number">{faculty.number}</span><h1>{faculty.title}</h1></div><p>{faculty.summary}</p></div>
        <div className="faculty-hero-footer"><span>TRI THỨC · KỶ LUẬT · BẢN LĨNH</span><a href="#chuong-trinh">Xem chương trình <ArrowUpRight size={17}/></a></div>
      </div>
    </section>

    <section className="faculty-overview section container">
      <div className="faculty-overview-lead"><span className="eyebrow"><span/>ĐỊNH HƯỚNG CỦA KHOA</span><h2>{faculty.description}</h2><p>Học viên được khuyến khích tiến bộ từ những việc cụ thể: chuẩn bị trước giờ học, thực hành có mục tiêu và biết chia sẻ kết quả với tập thể.</p></div>
      <aside className="faculty-focus-card"><div className="faculty-focus-icon"><Icon size={28}/></div><span className="faculty-focus-label">BA TRỌNG TÂM</span><ul>{faculty.focus.map((item) => <li key={item}><Check size={16}/>{item}</li>)}</ul></aside>
    </section>

    <section id="chuong-trinh" className="faculty-program section"><div className="container faculty-program-grid"><div><span className="eyebrow faculty-program-eyebrow"><span/>NHỊP HỌC TẬP</span><h2>Học chắc nền tảng.<br/><em>Làm được việc thật.</em></h2><p>Chương trình được tổ chức theo nhịp học rõ ràng, kết hợp kiến thức, thực hành và thói quen tự đánh giá để mỗi học viên nhìn thấy bước tiến của mình.</p></div><div className="faculty-module-list">{faculty.modules.map((module, index) => <div className="faculty-module" key={module}><span>0{index + 1}</span><strong>{module}</strong><ArrowUpRight size={16}/></div>)}</div></div></section>

    <section className="faculty-outcomes section container"><div className="section-heading"><div><span className="eyebrow"><span/>SAU MỖI HỌC KỲ</span><h2>Những năng lực được mang theo</h2></div><span className="faculty-outcomes-mark">{faculty.number} / 04</span></div><div className="faculty-outcome-grid">{faculty.outcomes.map((outcome, index) => <article key={outcome}><span>0{index + 1}</span><p>{outcome}</p></article>)}</div></section>

    <section className="faculty-next"><div className="container faculty-next-inner"><div><span className="eyebrow faculty-next-eyebrow"><span/>KHOA TIẾP THEO</span><h2>{nextFaculty.title}</h2></div><Link className="button gold-button" href={`/giao-duc/${nextFaculty.slug}`}>Khám phá khoa <ArrowUpRight size={18}/></Link></div></section>
    <div className="container faculty-back"><Link className="text-link" href="/giao-duc"><ArrowLeft size={17}/>Quay lại Giáo dục & rèn luyện</Link></div>
  </div>;
}
