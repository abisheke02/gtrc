import { useState, type FormEvent } from 'react'
import { Seo } from '../components/seo/Seo'
import { FaqSchema } from '../components/seo/StructuredData'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { site, faqs } from '../content/site'
import { post } from '../services/api'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      await post('/enquiries', Object.fromEntries(new FormData(form)))
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }

  const a = site.address
  return (
    <>
      <Seo title="Contact" path="/contact" description={`Contact Golden Trigger Rifle Club, Gerugambakkam, Chennai. Call ${site.phones[0]} or email ${site.email}.`} />
      <FaqSchema />
      <PageHeader eyebrow="Contact" title="Get in touch" intro="Questions about programmes, fees or timings? Call, WhatsApp or send us a message." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg text-gold">Address</h2>
              <address className="mt-1 not-italic text-mute">{a.street}, {a.locality}, {a.city}, {a.region} {a.postalCode}</address>
            </div>
            <div>
              <h2 className="text-lg text-gold">Phone / WhatsApp</h2>
              {site.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block text-mute hover:text-paper">{p}</a>)}
            </div>
            <div>
              <h2 className="text-lg text-gold">Email</h2>
              <a href={`mailto:${site.email}`} className="break-all text-mute hover:text-paper">{site.email}</a>
            </div>
            <iframe
              title="Map to Golden Trigger Rifle Club"
              src={site.mapEmbed}
              className="h-72 w-full rounded-xl border border-line grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-ink-2 p-6">
            <h2 className="text-2xl">Send a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" required className="input" /></div>
              <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" required type="tel" pattern="[0-9+ ]{10,15}" className="input" /></div>
            </div>
            <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" /></div>
            <div>
              <label className="label" htmlFor="subject">Interested in</label>
              <select id="subject" name="subject" className="input">
                <option>Trial session</option><option>Training programme</option><option>Membership</option><option>Events</option><option>Other</option>
              </select>
            </div>
            <div><label className="label" htmlFor="message">Message</label><textarea id="message" name="message" rows={4} required className="input" /></div>
            <Button type="submit" disabled={status === 'sending'} className="w-full">{status === 'sending' ? 'Sending…' : 'Send message'}</Button>
            {status === 'sent' && <p className="text-sm text-green-400 light:text-green-700" role="status">Thanks! We will get back to you within one working day.</p>}
            {status === 'error' && <p className="text-sm text-red-400 light:text-red-700" role="alert">{error}. You can also call us directly.</p>}
          </form>
        </div>
      </Section>
      <Section eyebrow="FAQ" title="Frequently asked questions" className="bg-ink-2">
        <div className="max-w-3xl divide-y divide-line rounded-xl border border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                <span className="mr-2 text-gold group-open:hidden">+</span><span className="mr-2 hidden text-gold group-open:inline">−</span>{f.q}
              </summary>
              <p className="mt-3 text-sm text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
