import Link from 'next/link';

const mentions = [
  { name: 'Quân khu 5 Online', logo: '/images/press/quankhu5-online.png', href: 'https://quankhu5.vn/' },
  { name: 'Quân đội nhân dân', logo: '/images/press/quandoinhandan.png', href: 'https://qdnd.vn/' },
  { name: 'Gia Lai TV', logo: '/images/press/gialai-tv.png', href: 'https://gialaitv.vn/' },
  { name: 'Đài Tiếng nói Việt Nam', logo: '/images/press/vov.svg', href: 'https://vov.vn/' },
  { name: 'Báo Gia Lai', wordmark: true, href: 'https://baogialai.com.vn/' },
  { name: 'VTV', logo: '/images/press/vtv.png', href: 'https://vtv.vn/' },
  { name: 'QPVN', logo: '/images/partner-qpan.png', href: 'https://qpvn.vn/' },
];

export function PressStrip() {
  const items = [...mentions, ...mentions, ...mentions];
  return (
    <section className="press-strip" aria-label="Báo chí viết về nhà trường">
      <div className="container press-strip-heading">
        <span className="eyebrow"><span />ĐƯỢC NHẮC ĐẾN TRÊN</span>
        <p>Báo chí viết về Phân hiệu 1</p>
      </div>
      <div className="press-marquee">
        <div className="press-track">
          {items.map((item, index) => (
            <Link href={item.href} target="_blank" rel="noreferrer" className="press-tile" key={`${item.name}-${index}`} aria-label={item.name}>
              <span className="press-mark">
                {'logo' in item ? <img src={item.logo} alt={item.name}/> : <span className="press-wordmark press-wordmark-gialai"><b>BÁO</b><strong>GIA LAI</strong></span>}
              </span>
              <span className="press-tile-name">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
