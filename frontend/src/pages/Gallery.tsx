import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { site } from '../content/site'

// Replace with real photos (hosted on Cloudinary, managed from the admin panel).
const placeholders = ['Range', 'Training', 'Junior batch', 'Match day', 'Medals', 'Coaching', 'Summer camp', 'Team', 'Equipment']

export default function Gallery() {
  return (
    <>
      <Seo title="Gallery" path="/gallery" description="Photos from training sessions, competitions and camps at Golden Trigger Rifle Club, Chennai." />
      <PageHeader eyebrow="Gallery" title="Life at the range" intro="Training sessions, match days, camps and medal moments." />
      <Section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {placeholders.map((p, i) => (
            <figure key={p} className={`target-bg flex items-end overflow-hidden rounded-lg border border-line bg-ink-2 p-4 ${i % 4 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
              <figcaption className="text-sm text-mute">{p}</figcaption>
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
