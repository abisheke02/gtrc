import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { benefits } from '../content/site'

const values = [
  { t: 'Safety', d: 'Every session is supervised, every shooter is briefed, and the rules are never bent.' },
  { t: 'Discipline', d: 'Shooting builds concentration, patience and self-control that carry into school, work and life.' },
  { t: 'Excellence', d: 'Structured coaching and honest feedback to help each shooter reach their best.' },
]

export default function About() {
  return (
    <>
      <Seo title="About Us" path="/about" description="About Golden Trigger Rifle Club: a professional shooting range and academy in Gerugambakkam, Chennai, focused on safety, discipline and excellence." />
      <PageHeader eyebrow="About us" title="Where the next champions start" intro="Golden Trigger is a professional shooting range and academy in Gerugambakkam, Chennai, built to develop young and adult shooters with world-class discipline." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4 text-mute">
            <h2 className="text-3xl text-paper">Our story</h2>
            <p>
              Golden Trigger Rifle Club started with a simple belief: with the right coaching, any child could become
              the next shooter to represent the state and the country. Our certified instructors give every shooter
              personal attention, whether it is their first time holding an air rifle or they are preparing for a national match.
            </p>
            <p>
              We train in 10m Air Rifle and Air Pistol, the Olympic disciplines that reward focus, consistency and calm
              more than strength. That makes shooting one of the few sports where a 10-year-old and a 50-year-old train side by side.
            </p>
            <p>
              We are committed to building a new generation of skilled, focused and disciplined shooters, with programmes
              designed to sharpen precision, build mental strength and grow confidence. Our shooters won team gold in
              both the men's and women's events, and silver in Master Men individual, at the Pondy Open 2025.
            </p>
            <p className="text-sm italic">[Founding year, founder/coach names and affiliations to be added: confirm with the club.]</p>
          </div>
          <div className="grid gap-4">
            {values.map((v) => (
              <div key={v.t} className="rounded-xl border border-line bg-ink-2 p-6">
                <h3 className="text-xl text-gold">{v.t}</h3>
                <p className="mt-2 text-sm text-mute">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section eyebrow="Why shooting" title="More than a sport">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <li key={b} className="flex gap-3 rounded-xl border border-line bg-ink-2 p-5 text-mute"><span className="text-gold">◎</span>{b}</li>
          ))}
        </ul>
      </Section>
      <Section eyebrow="Our mission" title="Precision. Discipline. Champions." className="bg-ink-2">
        <p className="max-w-3xl text-mute">
          To make professional shooting coaching accessible in Chennai, to put safety ahead of everything, and to give
          every shooter a clear, measurable path from beginner to competitor.
        </p>
        <div className="mt-8 flex gap-3"><Button to="/coaches">Meet the coaches</Button><Button to="/contact" variant="outline">Visit us</Button></div>
      </Section>
    </>
  )
}
