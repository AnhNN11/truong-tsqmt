import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:{default:'Phân hiệu 1 | Trường Thiếu sinh quân miền Trung',template:'%s | Thiếu sinh quân miền Trung'},description:'Khám phá Phân hiệu 1 – Trường Thiếu sinh quân miền Trung. Thông tin nhà trường, giáo dục, rèn luyện, tuyển sinh và hoạt động học sinh.',robots:{index:true,follow:true},openGraph:{type:'website',locale:'vi_VN',siteName:'Phân hiệu 1 – Trường Thiếu sinh quân miền Trung'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="vi"><body>{children}</body></html>;}

