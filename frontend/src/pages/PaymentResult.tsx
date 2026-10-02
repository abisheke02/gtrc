import { useSearchParams } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'
import { site } from '../content/site'

export default function PaymentResult({ ok }: { ok: boolean }) {
  const [params] = useSearchParams()
  const booking = params.get('booking')
  const donation = params.get('donation')
  return (
    <>
      <Seo title={ok ? 'Payment Successful' : 'Payment Failed'} path={ok ? '/payment/success' : '/payment/failed'} noindex />
      <Section>
        <div className="mx-auto max-w-lg rounded-xl border border-line bg-ink-2 p-8 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${ok ? 'bg-gold text-on-gold' : 'bg-red-500/20 text-red-300 light:text-red-700'}`}>{ok ? '✓' : '!'}</div>
          <h1 className="text-3xl">{ok ? (donation ? 'Thank you!' : 'Booking confirmed') : 'Payment failed'}</h1>
          <p className="mt-3 text-mute">
            {ok && donation
              ? 'Your donation was received and an acknowledgement has been sent to your email. You are helping the next generation of shooters.'
              : ok
              ? 'Thank you! Your payment was received and a confirmation has been sent to your email. Our team will call you to confirm your slot.'
              : 'Your payment did not go through. If any money was deducted, it will be refunded automatically within 5–7 working days.'}
          </p>
          {donation && <p className="mt-4 text-sm">Donation reference: <span className="font-mono text-gold">{donation}</span></p>}
          {booking && <p className="mt-4 text-sm">Booking reference: <span className="font-mono text-gold">{booking}</span></p>}
          <div className="mt-6 flex justify-center gap-3">
            <Button to={ok ? '/' : '/book'}>{ok ? 'Back to home' : 'Try again'}</Button>
            <Button href={`https://wa.me/${site.whatsapp}`} variant="outline">WhatsApp us</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
