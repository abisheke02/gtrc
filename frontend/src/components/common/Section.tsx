import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title?: string
  intro?: string
  children: ReactNode
  className?: string
}

export function Section({ eyebrow, title, intro, children, className = '' }: Props) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="container-x">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>}
            {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
            {intro && <p className="mt-4 text-mute">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
