import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { useCatalog } from '../hooks/useCatalog'
import { inr } from '../utils/format'

export default function Programs() {
  const { programs } = useCatalog()
  return (
    <>
      <Seo title="Training Programmes" path="/programs" description="10m Air Rifle and Air Pistol training programmes in Chennai for beginners, children and competitive shooters. Book online." />
      <PageHeader eyebrow="Programmes" title="Training programmes" intro="Every programme includes a safety certification, club equipment for beginners, and small batches so the coach can watch every shot." />
      <Section>
        <div className="space-y-6">
          {programs.map((p) => (
            <article key={p.slug} className="grid gap-6 rounded-xl border border-line bg-ink-2 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">{p.discipline} · {p.level}</p>
                <h2 className="mt-1 text-2xl">{p.name}</h2>
                <p className="mt-2 text-mute">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-mute">
                  <span><span className="text-paper">Age:</span> {p.ageGroup}</span>
                  <span><span className="text-paper">Duration:</span> {p.duration}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.highlights.map((h) => <li key={h} className="rounded-full border border-line px-3 py-1 text-xs">{h}</li>)}
                </ul>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <p className="font-display text-3xl">{inr(p.priceInr)}</p>
                <Button to={`/book?type=PROGRAM&item=${p.slug}`}>Enrol & Pay</Button>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
