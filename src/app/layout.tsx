import type { Metadata } from 'next';
import './globals.css';
export const runtime = 'nodejs';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata={metadataBase:new URL(siteUrl),title:{default:'Phân hiệu 1 | Trường Thiếu sinh quân miền Trung',template:'%s | Thiếu sinh quân miền Trung'},description:'Khám phá Phân hiệu 1 – Trường Thiếu sinh quân miền Trung. Thông tin nhà trường, giáo dục, rèn luyện, tuyển sinh và hoạt động học sinh.',alternates:{canonical:'/'},robots:{index:true,follow:true},openGraph:{type:'website',locale:'vi_VN',siteName:'Phân hiệu 1 – Trường Thiếu sinh quân miền Trung',title:'Phân hiệu 1 | Trường Thiếu sinh quân miền Trung',description:'Thông tin nhà trường, giáo dục, rèn luyện, tuyển sinh và hoạt động học sinh.',images:[{url:'/images/campus.webp',width:1600,height:900,alt:'Phân hiệu 1 – Trường Thiếu sinh quân miền Trung'}]},twitter:{card:'summary_large_image',title:'Phân hiệu 1 | Trường Thiếu sinh quân miền Trung',description:'Thông tin nhà trường, giáo dục, rèn luyện, tuyển sinh và hoạt động học sinh.',images:['/images/campus.webp']}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="vi"><body>{children}</body></html>;}

