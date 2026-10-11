import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getHeroSlides, getSettings } from '@/lib/db';
import { HeroSlidesForm, SettingsForm } from '@/components/admin-forms';
export default async function Settings(){if((await requireUser()).role!=='admin')redirect('/admin');return <><div className="admin-title"><div><h1>Giao diện & thông tin</h1><p>Cập nhật nội dung landing page và các thông tin chung của nhà trường.</p></div></div><SettingsForm settings={getSettings()}/><HeroSlidesForm slides={getHeroSlides(true)}/></>;}


