import type { Metadata } from 'next';
import { SITE, CONTACT, abs, metaDesc } from '@/config/site';
import { withOpenGraph } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = withOpenGraph({
  title: { absolute: 'Custom Bulk Meat Order Enquiry | Mr Meat & Co' },
  description: metaDesc(
    'Request a quote for custom bulk meat orders — volumes beyond the listed packs, custom cut sheets, recurring commercial delivery and whole-animal shares across NSW.'
  ),
  alternates: { canonical: `https://${SITE.domain}/wholesale/contact-us/` },
});

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Custom Bulk Meat Order Enquiry',
  url: `https://${SITE.domain}/wholesale/contact-us/`,
  isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
  about: {
    '@type': 'Organization',
    name: SITE.name,
    url: `https://${SITE.domain}/`,
    telephone: CONTACT.phone,
    email: `mailto:${CONTACT.email}`,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Wholesale', item: `https://${SITE.domain}/wholesale/` },
      { '@type': 'ListItem', position: 3, name: 'Custom Bulk Order Enquiry', item: `https://${SITE.domain}/wholesale/contact-us/` },
    ],
  },
};

export default function WholesaleContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
