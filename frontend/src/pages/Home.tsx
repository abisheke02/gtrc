import { Seo } from '../components/seo/Seo'
import { Button } from '../components/common/Button'
import { Section } from '../components/common/Section'
import { PriceCard } from '../components/common/PriceCard'
import { CountUp } from '../components/common/CountUp'
import { RangeLane } from '../components/sections/RangeLane'
import { Ticker } from '../components/sections/Ticker'
import { site, stats, testimonials, facilities, achievements } from '../content/site'
import { useCatalog } from '../hooks/useCatalog'

export default function Home() {
  const { programs } = useCatalog()
  return (
    <>
      <Seo title="Home" path="/" />
      <section className="target-bg relative overflow-hidden border-b border-line">
        <div className="container-x grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="rise mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gerugambakkam · Chennai</p>
            <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="rise-line"><span className="rise inline-block" style={{ '--d': '120ms' } as React.CSSProperties}>Train with <span className="text-shimmer">precision.</span></span></span>
              <span className="rise-line"><span className="rise inline-block" style={{ '--d': '260ms' } as React.CSSProperties}>Compete with confidence.</span></span>
            </h1>
            <p className="rise mt-6 max-w-xl text-lg text-mute" style={{ '--d': '420ms' } as React.CSSProperties}>
              A professional shooting range in Gerugambakkam, Chennai. Expert 10m Air Rifle and Pistol coaching for
              beginners and advanced shooters. With us, your child could be the next champion shooter.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ '--d': '560ms' } as React.CSSProperties}>
              <Button to="/book?type=PROGRAM&item=trial-session">Book a Trial Session</Button>
              <Button to="/programs" variant="outline">View Programmes</Button>
            </div>
          </div>
          {site.heroImage ? (
            <img src={site.heroImage} alt="Shooter training at Golden Trigger Rifle Club" className="hidden aspect-[4/5] w-full rounded-xl border border-line object-cover lg:block" />
          ) : (
            <RangeLane />
          )}
        </div>
        <Ticker />
        <div className="bg-ink-2/60">
          <dl className="container-x grid grid-cols-2 gap-6 py-8 sm:grid-cols-4" data-reveal="stagger">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl text-gold"><CountUp value={s.value} /></dt>
                <dd className="text-sm text-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section eyebrow="Programmes" title="Find your discipline" intro="Structured courses for every level, from your first trial session to competition preparation.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
          {programs.map((p) => (
            <PriceCard key={p.slug} type="PROGRAM" slug={p.slug} title={p.name} subtitle={p.level} price={p.priceInr} description={p.summary} cta="Enrol" />
          ))}
        </div>
      </Section>

      <Section eyebrow="Why GTRC" title="Built for focus and safety" className="bg-ink-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
          {facilities.slice(0, 3).map((f) => (
            <div key={f.title} className="lift rounded-xl border border-line p-6">
              <h3 className="text-lg text-gold">{f.title}</h3>
              <p className="mt-2 text-sm text-mute">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8"><Button to="/facilities" variant="ghost">See all facilities →</Button></div>
      </Section>

      <Section eyebrow="Achievements" title="Results that speak">
        <div className="grid gap-6 md:grid-cols-3" data-reveal="stagger">
          {achievements.map((a) => (
            <div key={a.detail} className="lift rounded-xl border border-line bg-ink-2 p-6">
              <p className={`font-display text-3xl ${a.result === 'Gold' ? 'text-gold' : 'text-paper/80'}`}>{a.result}</p>
              <p className="mt-2 text-paper">{a.detail}</p>
              <p className="text-sm text-mute">{a.event} {a.year}</p>
            </div>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section eyebrow="Testimonials" title="What our shooters say" className="bg-ink-2">
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.quote} className="rounded-xl border border-line bg-ink p-6">
                <blockquote className="text-paper/90">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-gold">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section className="!py-12">
        <div data-reveal className="flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-ink-2 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Follow us</p>
            <p className="mt-1 text-lg">Training updates, match results and photos on Instagram</p>
          </div>
          <Button href={site.social.instagram} variant="outline">@golden_trigger_shooting</Button>
        </div>
      </Section>

      <section className="border-t border-line bg-gold text-on-gold">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl">Ready for your first shot?</h2>
            <p className="mt-1 text-on-gold/80">Book a 60-minute trial session with a certified coach.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/book?type=PROGRAM&item=trial-session" className="!bg-on-gold !text-gold hover:!opacity-90">Book Trial</Button>
            <Button href={`tel:${site.phones[0].replace(/\s/g, '')}`} className="!border !border-on-gold !bg-transparent !text-on-gold">Call Us</Button>
          </div>
        </div>
      </section>
    </>
  )
}
