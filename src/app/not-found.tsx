import Link from 'next/link';
export default function NotFound(){return <main className="empty-state not-found"><span className="eyebrow">404 · KHÔNG TÌM THẤY</span><h1>Trang này chưa có hoặc đã được gỡ.</h1><p>Bạn có thể trở lại trang chủ để tiếp tục khám phá nhà trường.</p><Link href="/" className="button">Về trang chủ</Link></main>;}
