'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { HeroSlide, Settings } from '@/lib/types';
import { LandingArt } from '@/components/landing-art';

export function HeroCarousel({ settings, slides }: { settings: Settings; slides: HeroSlide[] }) {
 const items = slides.length ? slides : [{ id:'fallback', eyebrow:'PHÂN HIỆU 1', title:settings.heroTitle, description:settings.heroDescription, image:settings.heroImage, source:'', order_index:1, active:1 }];
 const [index,setIndex] = useState(0); const [paused,setPaused] = useState(false); const current=items[index]||items[0];
 useEffect(()=>{if(paused||items.length<2)return;const timer=window.setInterval(()=>setIndex(i=>(i+1)%items.length),7000);return()=>window.clearInterval(timer)},[paused,items.length]);
 return <section className="hero" aria-roledescription="carousel" aria-label="Hình ảnh nổi bật của Phân hiệu 1" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
  {items.map((slide,i)=><img key={slide.id} className={'hero-image '+(i===index?'is-active':'')} src={slide.image} alt={slide.title.replace('\n',' ')} fetchPriority={i===0?'high':'auto'} aria-hidden={i!==index}/>)}
  <div className="hero-shade"/>
  <LandingArt kind="drum-seal" className="hero-art" loading="eager" />
  <div className="container hero-content"><div className="hero-kicker">{current.eyebrow}</div><h1>{current.title.split('\n').map((line,i)=><span key={i} className={i===1?'gold':''}>{line}</span>)}</h1><p>{current.description}</p><div className="hero-actions"><Link className="button gold-button" href="/gioi-thieu">Khám phá nhà trường <ArrowUpRight size={19}/></Link><Link className="hero-secondary" href="/tin-tuc">Xem tin tức mới <ArrowRight size={19}/></Link></div><div className="hero-caption"><span className="hero-caption-line"/>TRI THỨC · KỶ LUẬT · BẢN LĨNH · KHÁT VỌNG</div></div>
  <div className="hero-index"><b>{String(index+1).padStart(2,'0')}</b><span>/</span>PHÂN HIỆU 1</div>
  {current.source&&<a className="hero-source" href={current.source} target="_blank" rel="noreferrer">Ảnh và thông tin: nguồn báo chí <ArrowUpRight size={13}/></a>}
  {items.length>1&&<div className="hero-controls" aria-label="Điều khiển carousel"><button type="button" aria-label="Ảnh trước" onClick={()=>setIndex(i=>(i-1+items.length)%items.length)}><ChevronLeft size={19}/></button><div className="hero-pagination">{items.map((slide,i)=><button key={slide.id} type="button" aria-label={'Chuyển đến ảnh '+(i+1)} aria-current={i===index?'true':undefined} onClick={()=>setIndex(i)}>{String(i+1).padStart(2,'0')}</button>)}</div><button type="button" aria-label={paused?'Chạy tự động':'Tạm dừng'} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button><button type="button" aria-label="Ảnh tiếp theo" onClick={()=>setIndex(i=>(i+1)%items.length)}><ChevronRight size={19}/></button></div>}
 </section>;
}
