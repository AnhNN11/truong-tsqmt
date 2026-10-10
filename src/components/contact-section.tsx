import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import type { Settings } from '@/lib/types';
import { LandingArt } from '@/components/landing-art';

export function ContactSection({ settings: s }: { settings: Settings }) {
  return (
    <section id="lien-he" className="section contact-section">
      <LandingArt kind="compass-flag" className="contact-section-art" />
      <div className="container contact-grid">
      <div>
        <span className="eyebrow">THÔNG TIN LIÊN HỆ</span>
        <div className="contact-identity" aria-hidden="true">
          <img src="/images/school-logo.jpg" alt="" />
          <div><span>PHÂN HIỆU 1</span><strong>THỐNG NHẤT · GIA LAI</strong></div>
        </div>
        <h2>{s.branch}<br />{s.schoolName}</h2>
        <div className="contact-detail">
          <MapPin />
          <div><strong>Địa chỉ</strong><p>{s.address}</p></div>
        </div>
        {s.phone && <div className="contact-detail"><Phone /><div><strong>Điện thoại</strong><a href={'tel:' + s.phone}>{s.phone}</a></div></div>}
        {s.email && <div className="contact-detail"><Mail /><div><strong>Email</strong><a href={'mailto:' + s.email}>{s.email}</a></div></div>}
        <a href={s.facebook} className="button outline-button" target="_blank" rel="noreferrer">Facebook của Phân hiệu <ArrowUpRight size={18} /></a>
        <div className="contact-map">
          <div className="map-heading"><MapPin size={22} /><span>THỐNG NHẤT · GIA LAI</span></div>
          <iframe title="Bản đồ vị trí Phân hiệu 1" src={'https://www.google.com/maps?q=' + encodeURIComponent(s.address) + '&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.address)} target="_blank" rel="noreferrer">Xem khu vực trên bản đồ <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <ContactForm />
      </div>
    </section>
  );
}
