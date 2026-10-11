import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import type { Settings } from '@/lib/types';
import styles from './contact-section.module.css';
import { HomeSectionGraphics } from './home-graphics';

export function ContactSection({ settings: s }: { settings: Settings }) {
  const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.address);

  return (
    <section id="lien-he" className={styles.section} aria-labelledby="contact-title">
      <HomeSectionGraphics scene="contact" />
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <div className={styles.kicker}><span>04</span> LIÊN HỆ NHÀ TRƯỜNG</div>
            <h2 id="contact-title">Kết nối với nhà trường.</h2>
          </div>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng gia đình.</p>
        </div>
        <div className={styles.layout}>
          <div className={styles.info}>
            <div className={styles.identity}>
              <img src="/images/school-logo.jpg" alt="" width={56} height={56} loading="lazy" />
              <div><span>{s.branch}</span><h3>{s.schoolName}</h3></div>
            </div>
            <dl className={styles.details}>
              <div>
                <dt><MapPin size={19} strokeWidth={1.5} aria-hidden="true" />Địa chỉ</dt>
                <dd>{s.address}</dd>
              </div>
              {s.phone && <div>
                <dt><Phone size={19} strokeWidth={1.5} aria-hidden="true" />Điện thoại</dt>
                <dd><a href={'tel:' + s.phone}>{s.phone}</a></dd>
              </div>}
              {s.email && <div>
                <dt><Mail size={19} strokeWidth={1.5} aria-hidden="true" />Email</dt>
                <dd><a href={'mailto:' + s.email}>{s.email}</a></dd>
              </div>}
            </dl>
            {s.facebook && <a href={s.facebook} className={styles.link} target="_blank" rel="noreferrer">Facebook của Phân hiệu <ArrowUpRight size={17} aria-hidden="true" /></a>}
            <div className={styles.map}>
              <div className={styles.mapHeading}>
                <h4>Vị trí nhà trường</h4>
                <a href={mapUrl} className={styles.link} target="_blank" rel="noreferrer">Chỉ đường <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
              <iframe title="Bản đồ vị trí Phân hiệu 1" src={'https://www.google.com/maps?q=' + encodeURIComponent(s.address) + '&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
