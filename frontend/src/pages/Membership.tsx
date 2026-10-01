import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/layout/PageHeader'
import { Section } from '../components/common/Section'
import { PriceCard } from '../components/common/PriceCard'
import { useCatalog } from '../hooks/useCatalog'

export default function Membership() {
  const { plans } = useCatalog()
  return (
    <>
      <Seo title="Membership & Fees" path="/membership" description="Membership plans and fees at Golden Trigger Rifle Club, Chennai. Monthly, quarterly and annual range access. Pay online." />
      <PageHeader eyebrow="Membership" title="Membership & fees" intro="For shooters who have finished a programme and want regular range time. Choose a plan and pay securely online." />
      <Section>
        <div className="grid gap-6 md:grid-cols-3" data-reveal="stagger">
          {plans.map((p) => (
            <PriceCard key={p.slug} type="PLAN" slug={p.slug} title={p.name} price={p.priceInr} period={p.period} bullets={p.features} featured={p.featured} cta="Join & Pay" />
          ))}
        </div>
        <p className="mt-8 text-sm text-mute">
          All fees include GST where applicable. Membership requires completing a beginner programme or a coach assessment.
          See our <a href="/refund-policy" className="text-gold underline">refund policy</a>.
        </p>
      </Section>
    </>
  )
}
