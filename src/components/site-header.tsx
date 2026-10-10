'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Emblem } from './brand';
import type { Settings } from '@/lib/types';
const nav=[['/','Trang chủ'],['/gioi-thieu','Giới thiệu'],['/giao-duc','Giáo dục & rèn luyện'],['/tin-tuc','Tin tức & sự kiện'],['/#lien-he','Liên hệ']];
export function SiteHeader({settings:s}:{settings:Settings}) {
 const path=usePathname();const [open,setOpen]=useState(false);const [search,setSearch]=useState(false);
 return <><div className="topbar"><div className="container topbar-inner"><span>KỶ CƯƠNG · TÌNH THƯƠNG · TRÁCH NHIỆM</span></div></div><header className="site-header"><div className="container masthead"><Link href="/" className="brand" onClick={()=>setOpen(false)}><Emblem/><span><span className="brand-over">{s.branch.toUpperCase()}</span><strong>{s.schoolName}</strong><span className="brand-sub">{s.tagline}</span></span></Link><button className="icon-button mobile-toggle" aria-label={open?'Đóng menu':'Mở menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><div className={`nav-wrap ${open?'is-open':''}`}><nav className="container main-nav" aria-label="Điều hướng chính">{nav.map(([href,label])=><Link className={(href==='/'?path==='/':href.startsWith('/#')?false:path.startsWith(href))?'active':''} href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}<button aria-label="Tìm kiếm" className="icon-button nav-search" onClick={()=>setSearch(!search)}><Search size={19}/></button></nav></div>{search&&<form action="/tin-tuc" className="container search-bar"><input autoFocus name="q" placeholder="Tìm bài viết, thông báo…" aria-label="Từ khóa tìm kiếm"/><button className="button" type="submit">Tìm kiếm <Search size={16}/></button></form>}</header></>;
}

