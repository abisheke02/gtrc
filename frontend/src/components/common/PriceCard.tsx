import { Button } from './Button'
import { inr } from '../../utils/format'
import type { ItemType } from '../../types'

interface Props {
  type: ItemType
  slug: string
  title: string
  subtitle?: string
  price: number
  period?: string
  description?: string
  bullets?: string[]
  featured?: boolean
  cta?: string
}

export function PriceCard({ type, slug, title, subtitle, price, period, description, bullets = [], featured, cta = 'Enrol & Pay' }: Props) {
  return (
    <article
      className={`lift flex flex-col rounded-xl border p-6 ${featured ? 'border-gold bg-ink-3 shadow-[0_0_0_1px_var(--color-gold)]' : 'border-line bg-ink-2'}`}
    >
      {featured && <span className="mb-3 self-start rounded bg-gold px-2 py-0.5 text-xs font-semibold uppercase text-ink">Most popular</span>}
      {subtitle && <p className="text-xs font-semibold uppercase tracking-widest text-gold">{subtitle}</p>}
      <h3 className="mt-1 text-xl">{title}</h3>
      <p className="mt-4 font-display text-3xl text-paper">
        {inr(price)} {period && <span className="font-sans text-sm normal-case text-mute">{period}</span>}
      </p>
      {description && <p className="mt-3 text-sm text-mute">{description}</p>}
      {bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2"><span className="text-gold">◎</span>{b}</li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-6">
        <Button to={`/book?type=${type}&item=${slug}`} className="w-full" variant={featured ? 'gold' : 'outline'}>{cta}</Button>
      </div>
    </article>
  )
}
