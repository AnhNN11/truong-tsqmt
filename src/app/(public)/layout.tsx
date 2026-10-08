import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getSettings } from '@/lib/db';
import { CookieConsent } from '@/components/cookie-consent';
export const dynamic='force-dynamic';
export default function Layout({children}:{children:React.ReactNode}) {const settings=getSettings();return <><a className="skip-link" href="#main-content">Đến nội dung chính</a><SiteHeader settings={settings}/><main id="main-content">{children}</main><SiteFooter settings={settings}/><CookieConsent/></>;}
