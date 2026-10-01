interface Props { eyebrow?: string; title: string; intro?: string }

export function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <header className="target-bg border-b border-line bg-ink-2">
      <div className="container-x py-14 sm:py-20">
        {eyebrow && <p style={{ '--d': '0ms' } as React.CSSProperties} className="rise mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>}
        <h1 style={{ '--d': '100ms' } as React.CSSProperties} className="rise text-4xl sm:text-5xl">{title}</h1>
        {intro && <p style={{ '--d': '220ms' } as React.CSSProperties} className="rise mt-4 max-w-2xl text-mute">{intro}</p>}
      </div>
    </header>
  )
}
