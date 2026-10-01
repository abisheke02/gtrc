import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { Photo } from '../components/common/Photo'
import { site, gallery } from '../content/site'

export default function Gallery() {
  return (
    <>
      <Seo title="Gallery" path="/gallery" description="Photos from training sessions, competitions and camps at Golden Trigger Rifle Club, Chennai." />
      <PageHeader eyebrow="Gallery" title="Life at the range" intro="Training sessions, match days, camps and medal moments." />
      <Section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {gallery.map((g, i) => (
            <figure key={g.caption + i} className="aspect-square overflow-hidden rounded-lg border border-line">
              <Photo src={g.image} alt={g.caption} />
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="mb-4 text-mute">See our latest posts on Instagram</p>
          <Button href={site.social.instagram} variant="outline">@golden_trigger_shooting</Button>
        </div>
      </Section>
    </>
  )
}
