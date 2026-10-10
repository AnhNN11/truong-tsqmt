import type { Settings } from '@/lib/types';

export function StructuredData({ settings: s }: { settings: Settings }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: s.schoolName,
    alternateName: s.branch,
    description: 'Phân hiệu 1 – Trường Thiếu sinh quân miền Trung tại Gia Lai.',
    url: siteUrl,
    logo: `${siteUrl}/images/school-logo.jpg`,
    sameAs: [s.facebook],
    email: s.email || undefined,
    telephone: s.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address,
      addressLocality: 'Gia Lai',
      addressCountry: 'VN',
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
