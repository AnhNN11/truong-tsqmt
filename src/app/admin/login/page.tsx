import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { Emblem } from '@/components/brand';
import { LoginForm } from '@/components/login-form';
export const dynamic='force-dynamic';
export const metadata={title:'Đăng nhập quản trị'};
export default async function Login(){if(await currentUser())redirect('/admin');return <main className="login-page"><div className="login-art"><img src="/images/campus.webp" alt="Khuôn viên Phân hiệu 1"/><div><Emblem/><span className="eyebrow light">PHÂN HIỆU 1</span><h1>Tri thức vững vàng.<br/>Kỷ luật vững bước.</h1><p>Trường Thiếu sinh quân miền Trung</p></div></div><div className="login-panel"><Link href="/" className="text-link">← Về website nhà trường</Link><div><span className="eyebrow">KHÔNG GIAN QUẢN TRỊ</span><h2>Chào mừng trở lại.</h2><p>Đăng nhập để cập nhật những câu chuyện của nhà trường.</p><LoginForm/></div><small>Phân hiệu 1 · Trường Thiếu sinh quân miền Trung</small></div></main>;}
