/**
 * Animated hero graphic: target rings draw in, a rifle scope searches and settles on
 * the centre, fires, and lands a 10.9. Pure SVG + CSS (see "Hero target" in index.css).
 */
export function HeroTarget() {
  const rings = [
    { r: 180, w: 2, o: 0.35 },
    { r: 145, w: 2, o: 0.5 },
    { r: 110, w: 2.5, o: 0.65 },
    { r: 75, w: 3, o: 0.85 },
    { r: 40, w: 3, o: 1 },
  ]
  return (
    <svg viewBox="-200 -200 400 400" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#d4a72c" stopOpacity=".35" />
          <stop offset="1" stopColor="#d4a72c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="190" fill="url(#glow)" className="pulse-ring" />

      <g className="recoil">
        {rings.map((ring, i) => (
          <circle
            key={ring.r}
            r={ring.r}
            fill="none"
            stroke="#d4a72c"
            strokeOpacity={ring.o}
            strokeWidth={ring.w}
            className="ring-draw"
            style={{ '--len': 2 * Math.PI * ring.r, '--d': `${i * 120}ms` } as React.CSSProperties}
          />
        ))}
        {[-1, 1].map((s) => (
          <g key={s} stroke="#d4a72c" strokeOpacity=".25" strokeWidth="1">
            <line x1={s * 190} y1="0" x2={s * 46} y2="0" />
            <line x1="0" y1={s * 190} x2="0" y2={s * 46} />
          </g>
        ))}
        <circle r="10" fill="#d4a72c" />
        <circle r="12" fill="none" stroke="#fff3c4" strokeWidth="2" className="ripple" />
        <circle r="5" fill="#0f1114" stroke="#fff3c4" strokeWidth="1.5" className="hole" />
      </g>

      <circle r="200" fill="#fff3c4" className="flash" />

      <g className="scope">
        <circle r="62" fill="none" stroke="#f5f2ea" strokeOpacity=".9" strokeWidth="2" />
        <circle r="62" fill="#f5f2ea" fillOpacity=".03" />
        <line x1="-80" y1="0" x2="-14" y2="0" stroke="#f5f2ea" strokeWidth="2" />
        <line x1="14" y1="0" x2="80" y2="0" stroke="#f5f2ea" strokeWidth="2" />
        <line x1="0" y1="-80" x2="0" y2="-14" stroke="#f5f2ea" strokeWidth="2" />
        <line x1="0" y1="14" x2="0" y2="80" stroke="#f5f2ea" strokeWidth="2" />
        <circle r="2" fill="#e5484d" />
      </g>

      <g className="score">
        <rect x="70" y="-150" width="104" height="52" rx="8" fill="#0f1114" stroke="#d4a72c" />
        <text x="122" y="-117" textAnchor="middle" fill="#d4a72c" fontFamily="Oswald, sans-serif" fontSize="28" fontWeight="600">10.9</text>
      </g>
    </svg>
  )
}
