export type LandingArtKind =
  | 'drum-seal'
  | 'mountain-pines'
  | 'academy-gate'
  | 'learning-books'
  | 'compass-flag';

const assets: Record<LandingArtKind, { png: string; webp: string }> = {
  'drum-seal': { png: '/images/landing-art/drum-seal.png', webp: '/images/landing-art/drum-seal.webp' },
  'mountain-pines': { png: '/images/landing-art/mountain-pines.png', webp: '/images/landing-art/mountain-pines.webp' },
  'academy-gate': { png: '/images/landing-art/academy-gate.png', webp: '/images/landing-art/academy-gate.webp' },
  'learning-books': { png: '/images/landing-art/learning-books.png', webp: '/images/landing-art/learning-books.webp' },
  'compass-flag': { png: '/images/landing-art/compass-flag.png', webp: '/images/landing-art/compass-flag.webp' },
};

export function LandingArt({ kind, className = '', loading = 'lazy' }: { kind: LandingArtKind; className?: string; loading?: 'eager' | 'lazy' }) {
  const asset = assets[kind];
  return <picture className={`landing-art ${className}`.trim()} aria-hidden="true">
    <source srcSet={asset.webp} type="image/webp" />
    <img src={asset.png} alt="" loading={loading} decoding="async" />
  </picture>;
}
