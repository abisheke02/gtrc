import { Seo } from '../components/seo/Seo'
import { Section } from '../components/common/Section'
import { Button } from '../components/common/Button'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" noindex />
      <Section>
        <div className="py-16 text-center">
          <p className="font-display text-7xl text-gold">404</p>
          <h1 className="mt-4 text-3xl">Missed the target</h1>
          <p className="mt-2 text-mute">This page doesn't exist.</p>
          <div className="mt-6"><Button to="/">Back to home</Button></div>
        </div>
      </Section>
    </>
  )
}
