'use client';

import { useState } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';

type GalleryItem = { url: string; name: string };
type ActivityCluster = { eyebrow: string; title: string; description: string; points: string[]; items: GalleryItem[] };

const clusterCopy = [
  { eyebrow: 'RÈN LUYỆN · SINH HOẠT', title: 'Một tập thể, nhiều khoảnh khắc gắn kết', description: 'Từ đội hình buổi sớm đến những giờ sinh hoạt chung, học viên học cách giữ nhịp cùng tập thể, lắng nghe và chủ động hoàn thành phần việc của mình.', points: ['Kỷ luật trong từng nhịp bước', 'Tinh thần đồng đội trong từng hoạt động'] },
  { eyebrow: 'HỌC TẬP · TÁC PHONG', title: 'Nền nếp tạo nên sự tự tin', description: 'Giờ tự học, chuẩn bị quân trang và giữ gìn đồng phục tạo thành những thói quen nhỏ nhưng bền vững, giúp học viên trưởng thành mỗi ngày.', points: ['Tự giác trong học tập và sinh hoạt', 'Chỉn chu từ những việc nhỏ nhất'] },
];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const clusters: ActivityCluster[] = [
    { ...clusterCopy[0], items: items.slice(0, 3) },
    { ...clusterCopy[1], items: items.slice(3, 6) },
  ];
  const imageButton = (item: GalleryItem, index: number, lead = false) => <button className={`activity-cluster-image ${lead ? 'is-lead' : ''}`} type="button" onClick={() => setSelected(item)} aria-label={`Mở ảnh ${item.name}`}>
    <img src={item.url} alt={item.name} loading="eager" />
    <span className="activity-cluster-index">0{index + 1}</span>
    <span className="activity-cluster-caption"><span>{item.name}</span><Maximize2 size={17} /></span>
  </button>;
  return <>
    <div className="activity-clusters">
      {clusters.map((cluster, clusterIndex) => <section className={`activity-cluster ${clusterIndex === 1 ? 'activity-cluster-light' : ''}`} key={cluster.title}>
        <div className="activity-cluster-copy">
          <span className="eyebrow"><span />{cluster.eyebrow}</span>
          <span className="activity-cluster-number">0{clusterIndex + 1}</span>
          <h3>{cluster.title}</h3>
          <p>{cluster.description}</p>
          <div className="activity-cluster-points">{cluster.points.map(point => <span key={point}><ArrowUpRight size={15} />{point}</span>)}</div>
        </div>
        <div className="activity-cluster-gallery">{cluster.items.map((item, index) => imageButton(item, clusterIndex * 3 + index, index === 0))}</div>
      </section>)}
    </div>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.name} onClick={() => setSelected(null)} onKeyDown={e => { if (e.key === 'Escape') setSelected(null); }}>
      <button autoFocus aria-label="Đóng ảnh" onClick={() => setSelected(null)}><X /></button>
      <img src={selected.url} alt={selected.name} />
      <p>{selected.name}</p>
    </div>}
  </>;
}
