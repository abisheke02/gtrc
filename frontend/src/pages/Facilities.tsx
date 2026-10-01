import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { facilities, site } from '../content/site'
import { Photo } from '../components/common/Photo'

export default function Facilities() {
  return (
    <>
      <Seo title="Range & Facilities" path="/facilities" description="10m air rifle and air pistol shooting range in Gerugambakkam, Chennai, with club equipment, electronic scoring and certified range officers." />
      <PageHeader eyebrow="Facilities" title="The range" intro="A dedicated, supervised 10m shooting range designed for focus, consistency and safety." />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <div key={f.title} className="overflow-hidden rounded-xl border border-line bg-ink-2">
              {f.image && <div className="aspect-video"><Photo src={f.image} alt={f.title} /></div>}
              <div className="p-6">
                <h2 className="text-lg text-gold">{f.title}</h2>
                <p className="mt-2 text-sm text-mute">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="Timings" title="Range hours" className="bg-ink-2">
        <ul className="max-w-lg divide-y divide-line rounded-xl border border-line">
          {site.hours.map((h) => (
            <li key={h.days} className="flex justify-between gap-4 p-4 text-sm"><span>{h.days}</span><span className="text-right text-mute">{h.time}</span></li>
          ))}
        </ul>
      </Section>
    </>
  )
}
