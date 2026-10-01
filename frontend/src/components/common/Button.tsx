import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'gold' | 'outline' | 'ghost'
const styles: Record<Variant, string> = {
  gold: 'btn-shine bg-gold text-ink hover:bg-gold-2',
  outline: 'border border-gold text-gold hover:bg-gold hover:text-ink',
  ghost: 'text-paper hover:text-gold',
}
const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-2.5 font-display text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none'

interface Props {
  to?: string
  href?: string
  variant?: Variant
  className?: string
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export function Button({ to, href, variant = 'gold', className = '', children, ...rest }: Props) {
  const cls = `${base} ${styles[variant]} ${className}`
  if (to) return <Link to={to} className={cls}>{children}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer">{children}</a>
  return <button className={cls} type={rest.type ?? 'button'} disabled={rest.disabled} onClick={rest.onClick}>{children}</button>
}
