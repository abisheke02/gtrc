import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { site } from '../content/site'

// DRAFT legal copy: the club must review it before launch (Razorpay checks these pages).
const pages = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect the details you enter on our forms (name, phone, email, the shooter\'s name and age, and the guardian\'s name) only to manage enquiries, bookings and memberships.',
      'Payments are processed by Razorpay. We never see or store your card, UPI or bank details.',
      'We do not sell or share your personal data with third parties, except where needed to process payments or where the law requires it.',
      `To view, correct or delete your data, email ${site.email}.`,
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'All shooting activity takes place under the supervision of club coaches and range officers. Shooters must follow all instructions and range safety rules.',
      'Shooters under 18 need written consent from a parent or guardian.',
      'The club may refuse or end range access for any unsafe behaviour, without a refund.',
      'Fees, schedules and programme content may change. Members will be told in advance.',
    ],
  },
  'refund-policy': {
    title: 'Refund & Cancellation Policy',
    body: [
      'Trial sessions: full refund if cancelled at least 24 hours before the session.',
      'Programmes: full refund before the first session. After that, fees are non-refundable, but unused sessions can be moved to another batch within 60 days.',
      'Memberships: non-refundable once started.',
      'Events: refundable up to 7 days before the event date.',
      'Approved refunds go back to the original payment method within 5–7 working days.',
      `For cancellations, contact ${site.phones[0]} or ${site.email}.`,
    ],
  },
  'safety-rules': {
    title: 'Range Safety Rules',
    body: [
      'Always treat every rifle and pistol as loaded.',
      'Always point the muzzle downrange, in a safe direction.',
      'Keep your finger off the trigger until you are on the firing line and ready to shoot.',
      'Load only on the firing line, and only when the range officer gives the command.',
      'Stop shooting immediately when you hear "Cease fire".',
      'Eye and ear protection must be worn as instructed. No food, phones or distractions on the firing line.',
    ],
  },
} as const

export type LegalSlug = keyof typeof pages

export default function Legal({ slug }: { slug: LegalSlug }) {
  const p = pages[slug]
  return (
    <>
      <Seo title={p.title} path={`/${slug}`} />
      <PageHeader title={p.title} intro={`Last updated: October 2026 · ${site.name}`} />
      <Section>
        <ol className="max-w-3xl list-decimal space-y-4 pl-5 text-mute marker:text-gold">
          {p.body.map((b) => <li key={b}>{b}</li>)}
        </ol>
      </Section>
    </>
  )
}
