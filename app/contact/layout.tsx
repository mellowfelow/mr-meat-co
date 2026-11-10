import type { Metadata } from 'next';
import { SITE, CONTACT, abs, metaDesc } from '@/config/site';
import { withOpenGraph } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = withOpenGraph({
  title: { absolute: 'Contact Mr Meat & Co — Alexandria Sydney Butcher' },
  description: metaDesc(
    'Contact the Mr Meat & Co butchery in Alexandria, Sydney — phone, WhatsApp and email for orders, custom cuts, delivery routes and wholesale enquiries. Open Mon–Sat.'
  ),
  alternates: { canonical: `https://${SITE.domain}/contact/` },
});

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Mr Meat & Co',
  url: `https://${SITE.domain}/contact/`,
  isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
  about: {
    '@type': 'Organization',
    name: SITE.name,
    url: `https://${SITE.domain}/`,
    email: `mailto:${CONTACT.email}`,
    telephone: CONTACT.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressLocality: 'Alexandria',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT.phone,
      email: `mailto:${CONTACT.email}`,
      areaServed: 'AU',
      availableLanguage: 'en',
    },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactSchema} />
      {children}
    </>
  );
}
