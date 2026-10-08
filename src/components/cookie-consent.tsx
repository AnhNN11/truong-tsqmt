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
 return <aside className="cookie-consent" role="dialog" aria-label="Tùy chọn cookie" aria-live="polite">
  <div className="cookie-consent-icon" aria-hidden="true"><Cookie size={20}/></div>
  <div className="cookie-consent-copy"><strong>Cookie trên website</strong><p>Website dùng cookie cần thiết để hoạt động ổn định. Cookie đo lường hoặc bên thứ ba chỉ được bật khi bạn đồng ý. Xem <Link href="/chinh-sach-cookie">Chính sách cookie</Link>.</p></div>
  <div className="cookie-consent-actions"><button type="button" className="cookie-essential" onClick={()=>choose('necessary')}>Chỉ cookie cần thiết</button><button type="button" className="button cookie-accept" onClick={()=>choose('all')}>Cho phép tất cả</button></div>
  <button type="button" className="cookie-close" aria-label="Đóng thông báo cookie" onClick={()=>choose('necessary')}><X size={17}/></button>
 </aside>;
}
