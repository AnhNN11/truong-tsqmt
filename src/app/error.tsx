'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="empty-state"><h1>Đã có lỗi khi tải trang</h1><p>Vui lòng thử lại. Nội dung đã lưu vẫn được giữ trong hệ thống.</p><button className="button" onClick={reset}>Thử lại</button></main>;}
