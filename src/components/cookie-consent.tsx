'use client';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'tsqmt-cookie-consent';

export function CookieConsent() {
 const [visible, setVisible] = useState(false);
 useEffect(() => { const timer = window.setTimeout(() => setVisible(window.localStorage.getItem(CONSENT_KEY) === null), 0); return () => window.clearTimeout(timer); }, []);
 function choose(value: 'necessary' | 'all') {
  window.localStorage.setItem(CONSENT_KEY, value);
  document.cookie = `tsqmt_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
  setVisible(false);
 }
 if (!visible) return null;
 return <aside className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" aria-live="polite">
  <div className="cookie-consent-icon" aria-hidden="true"><Cookie size={20}/></div>
  <div className="cookie-consent-copy"><span className="cookie-consent-eyebrow">QUYỀN RIÊNG TƯ</span><strong id="cookie-consent-title">Cookie trên website</strong><p id="cookie-consent-description">Cookie cần thiết giúp website hoạt động ổn định. Cookie đo lường chỉ bật khi bạn đồng ý. <Link href="/chinh-sach-cookie">Xem chính sách cookie</Link>.</p></div>
  <div className="cookie-consent-actions"><button type="button" className="cookie-essential" onClick={()=>choose('necessary')}>Chỉ cookie cần thiết</button><button type="button" className="button cookie-accept" onClick={()=>choose('all')}>Cho phép tất cả</button></div>
  <button type="button" className="cookie-close" aria-label="Đóng thông báo cookie" onClick={()=>choose('necessary')}><X size={17}/></button>
 </aside>;
}
