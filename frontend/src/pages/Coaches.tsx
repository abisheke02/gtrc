import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { coaches } from '../content/site'
import { Photo } from '../components/common/Photo'

export default function Coaches() {
  return (
    <>
      <Seo title="Our Coaches" path="/coaches" description="Meet the certified shooting coaches at Golden Trigger Rifle Club, Chennai." />
      <PageHeader eyebrow="Coaches" title="Meet the coaches" intro="Certified instructors who give every shooter personal guidance, from safe handling to match-day routines." />
      <Section>
        <div className="grid gap-6 md:grid-cols-3" data-reveal="stagger">
          {coaches.map((c) => (
            <article key={c.role + c.name} className="lift overflow-hidden rounded-xl border border-line bg-ink-2">
              <div className="aspect-[4/3]"><Photo src={c.image} alt={c.name} label="Photo coming soon" /></div>
              <div className="p-6">
                <h2 className="text-xl">{c.name}</h2>
                <p className="text-sm text-gold">{c.role}</p>
                <p className="mt-3 text-sm text-mute">{c.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.certs.map((x) => <li key={x} className="rounded-full border border-line px-3 py-1 text-xs">{x}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
