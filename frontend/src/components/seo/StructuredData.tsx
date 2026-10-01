import { site, faqs } from '../../content/site'

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function OrganizationSchema() {
  const a = site.address
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['SportsActivityLocation', 'SportsClub'],
        name: site.name,
        description: site.description,
        url: site.url,
        email: site.email,
        telephone: site.phones[0],
        sport: 'Shooting',
        address: {
          '@type': 'PostalAddress',
          streetAddress: a.street,
          addressLocality: `${a.locality}, ${a.city}`,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        sameAs: Object.values(site.social),
      }}
    />
  )
}

export function FaqSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }}
    />
  )
}
