import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { useCatalog } from '../hooks/useCatalog'
import { inr } from '../utils/format'
import { disciplines, pathway } from '../content/site'

export default function Programs() {
  const { programs } = useCatalog()
  return (
    <>
      <Seo title="Training Programmes" path="/programs" description="10m Air Rifle and Air Pistol training programmes in Chennai for beginners, children and competitive shooters. Book online." />
      <PageHeader eyebrow="Programmes" title="Training programmes" intro="Every programme includes a safety certification, club equipment for beginners, and small batches so the coach can watch every shot." />
      <Section eyebrow="The disciplines" title="Olympic precision sport">
        <div className="grid gap-6 md:grid-cols-2" data-reveal="stagger">
          {disciplines.map((d) => (
            <div key={d.name} className="lift rounded-xl border border-line bg-ink-2 p-6">
              <h2 className="text-2xl text-gold">{d.name}</h2>
              <p className="mt-3 text-mute">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="Courses & fees" title="Choose a programme" className="!pt-0">
        <div className="space-y-6" data-reveal="stagger">
          {programs.map((p) => (
            <article key={p.slug} className="lift grid gap-6 rounded-xl border border-line bg-ink-2 p-6 md:grid-cols-[1fr_auto] md:items-center">
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
      <Section eyebrow="Your pathway" title="From first shot to nationals" className="bg-ink-2">
        <ol className="grid gap-4 md:grid-cols-5" data-reveal="stagger">
          {pathway.map((p, i) => (
            <li key={p.step} className="rounded-xl border border-line bg-ink p-5">
              <span className="font-display text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-lg">{p.step}</h3>
              <p className="mt-2 text-sm text-mute">{p.text}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
