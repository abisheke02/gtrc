import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { useCatalog } from '../hooks/useCatalog'
import { inr, longDate } from '../utils/format'

export default function Events() {
  const { events } = useCatalog()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.date >= today)
  const past = events.filter((e) => e.date < today)

  return (
    <>
      <Seo title="Events & Competitions" path="/events" description="Upcoming shooting competitions, club matches and camps at Golden Trigger Rifle Club, Chennai. Register and pay online." />
      <PageHeader eyebrow="Events" title="Events & competitions" intro="Club matches, holiday camps and competition preparation. Register online to save your spot." />
      <Section title="Upcoming">
        {upcoming.length === 0 && <p className="text-mute">No upcoming events right now. Follow us on Instagram for announcements.</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {upcoming.map((e) => (
            <article key={e.slug} className="flex flex-col rounded-xl border border-line bg-ink-2 p-6">
              <p className="text-sm font-semibold text-gold">{longDate(e.date)}</p>
              <h3 className="mt-1 text-2xl">{e.name}</h3>
              <p className="mt-1 text-sm text-mute">{e.location}</p>
              <p className="mt-3 text-mute">{e.summary}</p>
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="font-display text-2xl">{inr(e.priceInr)}</span>
                <Button to={`/book?type=EVENT&item=${e.slug}`}>Register</Button>
              </div>
            </article>
          ))}
        </div>
      </Section>
      {past.length > 0 && (
        <Section title="Past events & results" className="bg-ink-2">
          <ul className="space-y-3">
            {past.map((e) => <li key={e.slug} className="text-mute"><span className="text-paper">{e.name}</span> · {longDate(e.date)}</li>)}
          </ul>
        </Section>
      )}
    </>
  )
}
