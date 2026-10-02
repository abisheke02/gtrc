import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { donation } from '../content/site'
import { startDonation } from '../services/payment'
import { inr } from '../utils/format'

export default function Donate() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number>(donation.presets[2])
  const [custom, setCustom] = useState('')
  const [wantsReceipt, setWantsReceipt] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = custom ? Number(custom) : amount
  const validAmount = Number.isInteger(finalAmount) && finalAmount >= 100 && finalAmount <= 1_000_000

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validAmount) { setError('Enter a whole-rupee amount between ₹100 and ₹10,00,000.'); return }
    const f = new FormData(e.currentTarget)
    const text = (k: string) => String(f.get(k) ?? '').trim() || undefined
    setBusy(true)
    setError('')
    try {
      const { donationId } = await startDonation({
        amountInr: finalAmount,
        purpose: String(f.get('purpose')),
        name: String(f.get('name')).trim(),
        email: String(f.get('email')).trim(),
        phone: String(f.get('phone')).trim(),
        pan: wantsReceipt ? text('pan') : undefined,
        address: wantsReceipt ? text('address') : undefined,
        message: text('message'),
        anonymous: f.get('anonymous') === 'on',
      })
      navigate(`/payment/success?donation=${donationId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title="Donate" path="/donate" description="Support Golden Trigger Rifle Club: fund junior shooter scholarships, range upkeep and competition travel. Secure online donation by UPI, card or netbanking." />
      <PageHeader eyebrow="Support the club" title="Back the next champion" intro="Your donation helps young shooters train, travel and compete. Every rupee goes to the purpose you choose." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-line bg-ink-2 p-6">
            <fieldset>
              <legend className="mb-3 font-display text-lg uppercase text-gold">Amount</legend>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Donation amount">
                {donation.presets.map((p) => {
                  const active = !custom && amount === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setAmount(p); setCustom('') }}
                      aria-pressed={active}
                      className={`rounded-md border px-4 py-2 font-display transition-colors ${active ? 'border-gold bg-gold text-on-gold' : 'border-line hover:border-gold'}`}
                    >{inr(p)}</button>
                  )
                })}
              </div>
              <div className="mt-4 max-w-xs">
                <label className="label" htmlFor="custom">Or enter another amount (₹)</label>
                <input id="custom" inputMode="numeric" className="input" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 3000" />
              </div>
            </fieldset>

            <div>
              <label className="label" htmlFor="purpose">Where should it go?</label>
              <select id="purpose" name="purpose" className="input">
                {donation.purposes.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <fieldset className="space-y-4">
              <legend className="mb-2 font-display text-lg uppercase text-gold">Your details</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required className="input" autoComplete="name" /></div>
                <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" required type="tel" pattern="[0-9+ ]{10,15}" className="input" autoComplete="tel" /></div>
              </div>
              <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" required type="email" className="input" autoComplete="email" /></div>
              <div><label className="label" htmlFor="message">Message (optional)</label><textarea id="message" name="message" rows={2} maxLength={500} className="input" /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="anonymous" className="accent-[var(--color-gold)]" />
                Keep my name private
              </label>
            </fieldset>

            {donation.taxReceipts && (
              <fieldset className="space-y-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={wantsReceipt} onChange={(e) => setWantsReceipt(e.target.checked)} className="accent-[var(--color-gold)]" />
                  I need a tax-exemption (80G) receipt
                </label>
                {wantsReceipt && (
                  <div className="grid gap-4">
                    <div className="max-w-xs"><label className="label" htmlFor="pan">PAN</label><input id="pan" name="pan" required pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" maxLength={10} className="input uppercase" placeholder="ABCDE1234F" /></div>
                    <div><label className="label" htmlFor="address">Address</label><textarea id="address" name="address" required rows={2} maxLength={300} className="input" /></div>
                  </div>
                )}
              </fieldset>
            )}

            {error && <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 light:text-red-700" role="alert">{error}</p>}
            <Button type="submit" disabled={busy || !validAmount} className="w-full">
              {busy ? 'Processing…' : `Donate ${validAmount ? inr(finalAmount) : ''} securely`}
            </Button>
          </form>

          <aside className="h-fit space-y-4 rounded-xl border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-xl">Where your money goes</h2>
            <ul className="space-y-3 text-sm text-mute">
              <li><span className="text-gold">◎</span> Scholarships for junior shooters who cannot afford coaching</li>
              <li><span className="text-gold">◎</span> Range, targets and air-rifle upkeep</li>
              <li><span className="text-gold">◎</span> Entry fees and travel to state and national meets</li>
            </ul>
            <ul className="space-y-2 border-t border-line pt-4 text-sm text-mute">
              <li>✓ Secure payment by Razorpay</li>
              <li>✓ UPI, cards, netbanking and wallets</li>
              <li>✓ Acknowledgement sent by email</li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  )
}
