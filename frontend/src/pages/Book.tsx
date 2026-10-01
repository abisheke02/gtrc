import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { useCatalog } from '../hooks/useCatalog'
import { startPayment } from '../services/payment'
import { inr } from '../utils/format'
import type { ItemType } from '../types'

interface Option { type: ItemType; slug: string; label: string; price: number }

export default function Book() {
  const catalog = useCatalog()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const options = useMemo<Option[]>(() => [
    ...catalog.programs.map((p) => ({ type: 'PROGRAM' as const, slug: p.slug, label: `Programme: ${p.name}`, price: p.priceInr })),
    ...catalog.plans.map((p) => ({ type: 'PLAN' as const, slug: p.slug, label: `Membership: ${p.name}`, price: p.priceInr })),
    ...catalog.events.map((e) => ({ type: 'EVENT' as const, slug: e.slug, label: `Event: ${e.name}`, price: e.priceInr })),
  ], [catalog])

  const initial = `${params.get('type') ?? 'PROGRAM'}:${params.get('item') ?? 'trial-session'}`
  const [selected, setSelected] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [isMinor, setIsMinor] = useState(false)

  const choice = options.find((o) => `${o.type}:${o.slug}` === selected) ?? options[0]

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!choice) return
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setBusy(true)
    setError('')
    try {
      const { bookingId } = await startPayment({
        itemType: choice.type,
        itemSlug: choice.slug,
        name: f.name,
        email: f.email,
        phone: f.phone,
        participantName: f.participantName || f.name,
        participantAge: f.participantAge ? Number(f.participantAge) : undefined,
        guardianName: f.guardianName || undefined,
        preferredDate: f.preferredDate || undefined,
        notes: f.notes || undefined,
      })
      navigate(`/payment/success?booking=${bookingId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title="Book & Pay Online" path="/book" description="Book a trial session, enrol in a programme, buy a membership or register for an event at Golden Trigger Rifle Club. Secure online payment." />
      <PageHeader eyebrow="Book online" title="Book & pay" intro="Choose what you would like to book, fill in the details and pay securely by UPI, card or netbanking." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-line bg-ink-2 p-6">
            <div>
              <label className="label" htmlFor="item">I want to book</label>
              <select id="item" className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                {options.map((o) => <option key={`${o.type}:${o.slug}`} value={`${o.type}:${o.slug}`}>{o.label} ({inr(o.price)})</option>)}
              </select>
            </div>

            <fieldset className="space-y-4">
              <legend className="mb-2 font-display text-lg uppercase text-gold">Your details</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required className="input" autoComplete="name" /></div>
                <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" required type="tel" pattern="[0-9+ ]{10,15}" className="input" autoComplete="tel" /></div>
              </div>
              <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" required type="email" className="input" autoComplete="email" /></div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 font-display text-lg uppercase text-gold">Shooter details</legend>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} className="accent-[var(--color-gold)]" />
                I am booking for my child (under 18)
              </label>
              <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
                <div><label className="label" htmlFor="participantName">Shooter's name {!isMinor && <span className="text-xs">(if different)</span>}</label><input id="participantName" name="participantName" required={isMinor} className="input" /></div>
                <div><label className="label" htmlFor="participantAge">Age</label><input id="participantAge" name="participantAge" type="number" min={8} max={90} required={isMinor} className="input" /></div>
              </div>
              {isMinor && <div><label className="label" htmlFor="guardianName">Parent / guardian name</label><input id="guardianName" name="guardianName" required className="input" /></div>}
              <div><label className="label" htmlFor="preferredDate">Preferred start date</label><input id="preferredDate" name="preferredDate" type="date" className="input" /></div>
              <div><label className="label" htmlFor="notes">Notes (optional)</label><textarea id="notes" name="notes" rows={3} className="input" placeholder="Prior experience, preferred timing…" /></div>
            </fieldset>

            <label className="flex items-start gap-2 text-sm text-mute">
              <input type="checkbox" required className="mt-1 accent-[var(--color-gold)]" />
              <span>I agree to the <a href="/terms" target="_blank" className="text-gold underline">terms</a>, <a href="/refund-policy" target="_blank" className="text-gold underline">refund policy</a> and <a href="/safety-rules" target="_blank" className="text-gold underline">range safety rules</a>{isMinor && ', and I consent as parent/guardian'}.</span>
            </label>

            {error && <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300" role="alert">{error}</p>}
            <Button type="submit" disabled={busy || !choice} className="w-full">
              {busy ? 'Processing…' : `Pay ${choice ? inr(choice.price) : ''} securely`}
            </Button>
          </form>

          <aside className="h-fit space-y-4 rounded-xl border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-xl">Order summary</h2>
            {choice && (
              <div className="flex justify-between gap-4 border-b border-line pb-4">
                <span className="text-mute">{choice.label}</span>
                <span className="font-display text-xl">{inr(choice.price)}</span>
              </div>
            )}
            <ul className="space-y-2 text-sm text-mute">
              <li>✓ Secure payment by Razorpay</li>
              <li>✓ UPI, cards, netbanking and wallets</li>
              <li>✓ Confirmation sent by email</li>
              <li>✓ Our team will call you to confirm your slot</li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  )
}
