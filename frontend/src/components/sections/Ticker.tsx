const items = [
  'Pondy Open 2025 · Gold · Women’s Team',
  'Pondy Open 2025 · Gold · Men’s Team',
  'Pondy Open 2025 · Silver · Master Men',
  '10m Air Rifle',
  '10m Air Pistol',
  'Beginner to Competition',
  'Gerugambakkam · Chennai',
]

/** Infinite scrolling band of achievements (pauses on hover). */
export function Ticker() {
  const row = items.map((t) => (
    <span key={t} className="flex items-center gap-6 px-6 font-display text-sm uppercase tracking-[0.2em]">
      {t}<span className="text-ink/50">◎</span>
    </span>
  ))
  return (
    <div className="overflow-hidden border-y border-gold bg-gold py-3 text-ink" aria-label="Achievements">
      <div className="marquee" aria-hidden>{row}{row}</div>
    </div>
  )
}
