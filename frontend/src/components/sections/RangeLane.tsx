import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import './range-lane.css'

/**
 * Interactive 10m air-rifle lane for the home hero: click (or press Enter) to fire a ten-shot string
 * at a paper target, get decimal scoring, group size, and change the target on the carrier.
 * Sound is synthesised with Web Audio (no files) and only starts after the first click.
 */

const SHOTS_PER_STRING = 10
const TARGET_MM = 45.5 // outer ring diameter of a 10m air-rifle target; used only to show group size in mm

type Tone = 'x' | 'ten' | 'hi' | 'low' | 'miss'
interface ShotResult { val: number; label: string; tone: Tone; onPaper: boolean }
interface Hole { id: number; x: number; y: number; onPaper: boolean; jag: number }
interface Chip { id: number; label: string; tone: Tone }

const JAGS = [
  'polygon(50% 2%,66% 7%,80% 17%,91% 31%,96% 49%,90% 66%,79% 81%,64% 92%,49% 96%,33% 91%,18% 80%,7% 65%,3% 48%,8% 31%,19% 16%,35% 6%)',
  'polygon(52% 1%,70% 9%,84% 22%,94% 38%,95% 55%,88% 71%,75% 85%,58% 95%,42% 97%,27% 89%,12% 77%,4% 60%,2% 42%,10% 25%,24% 11%,39% 3%)',
  'polygon(47% 3%,63% 5%,77% 14%,90% 27%,97% 45%,93% 63%,84% 79%,69% 91%,52% 98%,35% 94%,20% 84%,8% 69%,3% 51%,6% 33%,15% 18%,30% 8%)',
]

const fmt = (n: number) => (Math.round(n * 10) / 10).toFixed(1)

/** Ring k (1..10, 10 = bullseye) spans radius (10-k)*0.1 .. (11-k)*0.1 of the target radius. */
function score(dist: number, radius: number): ShotResult {
  if (dist > radius * 0.99) return { val: 0, label: 'MISS', tone: 'miss', onPaper: false }
  if (dist <= radius * 0.04) return { val: 10.9, label: 'X', tone: 'x', onPaper: true }
  if (dist <= radius * 0.1) {
    const val = Math.round((10 + (1 - dist / (radius * 0.1)) * 0.9) * 10) / 10
    return { val, label: val.toFixed(1), tone: 'ten', onPaper: true }
  }
  const ring = Math.max(1, 10 - Math.floor(dist / (radius * 0.1)))
  return { val: ring, label: String(ring), tone: ring >= 8 ? 'hi' : 'low', onPaper: true }
}

function useSound() {
  const ac = useRef<AudioContext | null>(null)
  const master = useRef<GainNode | null>(null)

  const ctx = () => {
    if (!ac.current) {
      ac.current = new AudioContext()
      master.current = ac.current.createGain()
      master.current.gain.value = 0.7
      master.current.connect(ac.current.destination)
    }
    if (ac.current.state === 'suspended') void ac.current.resume()
    return { a: ac.current, out: master.current! }
  }
  const noise = (a: AudioContext, dur: number) => {
    const b = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return b
  }

  const shot = (onPaper: boolean) => {
    try {
      const { a, out } = ctx(), t = a.currentTime
      const n = a.createBufferSource(); n.buffer = noise(a, 0.2)
      const f = a.createBiquadFilter(); f.type = 'lowpass'
      f.frequency.setValueAtTime(onPaper ? 2400 : 1200, t)
      f.frequency.exponentialRampToValueAtTime(400, t + 0.15)
      const g = a.createGain()
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
      n.connect(f); f.connect(g); g.connect(out); n.start(t)
      const o = a.createOscillator(); o.type = 'sine'
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.12)
      const og = a.createGain()
      og.gain.setValueAtTime(0.4, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
      o.connect(og); og.connect(out); o.start(t); o.stop(t + 0.18)
    } catch { /* audio unavailable */ }
  }
  const click = () => {
    try {
      const { a, out } = ctx(), t = a.currentTime
      const s = a.createBufferSource(); s.buffer = noise(a, 0.03)
      const hf = a.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 2500
      const g = a.createGain()
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03)
      s.connect(hf); hf.connect(g); g.connect(out); s.start(t)
    } catch { /* audio unavailable */ }
  }
  const thunk = () => {
    try {
      const { a, out } = ctx(), t = a.currentTime
      const o = a.createOscillator(); o.type = 'sine'
      o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12)
      const g = a.createGain()
      g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
      o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.18)
    } catch { /* audio unavailable */ }
  }
  useEffect(() => () => { void ac.current?.close(); ac.current = null }, [])
  return { shot, click, thunk }
}

export function RangeLane() {
  const laneRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const retRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const lastShot = useRef(0)
  const recoil = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const reduced = useRef(false)

  const [holes, setHoles] = useState<Hole[]>([])
  const [chips, setChips] = useState<Chip[]>([])
  const [pts, setPts] = useState<{ x: number; y: number }[]>([])
  const [total, setTotal] = useState(0)
  const [best, setBest] = useState<string>('—')
  const [shots, setShots] = useState(0)
  const [phase, setPhase] = useState<'above' | 'idle' | 'down'>('above')
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [hot, setHot] = useState(false)
  const [hideRet, setHideRet] = useState(true)
  const sound = useSound()

  const complete = shots >= SHOTS_PER_STRING
  const cycling = phase !== 'idle'

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches
    let r1 = 0, r2 = 0, t = 0
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setPhase('idle')) })
    t = window.setTimeout(() => { if (!muted) sound.thunk() }, 900)
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reticle: damped follow + breathing sway, desktop pointers only.
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    const lane = laneRef.current!
    const m = mouse.current
    m.x = m.cx = lane.clientWidth / 2
    m.y = m.cy = lane.clientHeight * 0.42
    let raf = 0
    const loop = (t: number) => {
      const s = t / 1000
      const sway = reduced.current ? { x: 0, y: 0 } : { x: Math.sin(s * 1.05) * 2.2 + Math.sin(s * 0.42) * 1.5, y: Math.cos(s * 0.78) * 2.6 + Math.sin(s * 0.31) * 1.3 }
      m.cx += (m.x - m.cx) * 0.16; m.cy += (m.y - m.cy) * 0.16
      recoil.current.x *= 0.82; recoil.current.y *= 0.82
      const ret = retRef.current
      if (ret) ret.style.transform = `translate3d(${(m.cx + sway.x + recoil.current.x).toFixed(1)}px,${(m.cy + sway.y + recoil.current.y).toFixed(1)}px,0)`
      const paper = paperRef.current
      if (paper) {
        const lr = lane.getBoundingClientRect(), pr = paper.getBoundingClientRect()
        const inside = Math.hypot(m.cx - (pr.left + pr.width / 2 - lr.left), m.cy - (pr.top + pr.height / 2 - lr.top)) <= pr.width / 2
        setHot((h) => (h === inside ? h : inside))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const fx = useCallback((x: number, y: number, label: string, tone: Tone) => {
    const lane = laneRef.current!
    const add = (el: HTMLElement, ms: number) => { lane.appendChild(el); setTimeout(() => el.remove(), ms) }
    const ping = document.createElement('span')
    ping.className = 'rl-ping'; ping.style.left = `${x}px`; ping.style.top = `${y}px`
    add(ping, 500)
    const pop = document.createElement('span')
    pop.className = `rl-pop rl-${tone}`; pop.textContent = label; pop.style.left = `${x}px`; pop.style.top = `${y - 24}px`
    add(pop, 900)
    if (reduced.current) return
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('i')
      s.className = 'rl-spark'; s.style.left = `${x}px`; s.style.top = `${y}px`
      lane.appendChild(s)
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.6, sp = 26 + Math.random() * 64
      const dx = Math.cos(ang) * sp, dy0 = Math.sin(ang) * sp, dy1 = dy0 + 40 + Math.random() * 44
      s.animate(
        [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${dx * 0.7}px,${dy0}px)`, opacity: 1, offset: 0.55 }, { transform: `translate(${dx}px,${dy1}px)`, opacity: 0 }],
        { duration: 420 + Math.random() * 180, easing: 'cubic-bezier(.2,.5,.4,1)' },
      ).onfinish = () => s.remove()
    }
  }, [])

  const fire = useCallback((x: number, y: number) => {
    const lane = laneRef.current, paper = paperRef.current
    if (!lane || !paper) return
    const now = performance.now()
    if (cycling || now - lastShot.current < 260) return
    lastShot.current = now
    setStarted(true)
    if (complete) { if (!muted) sound.click(); return }

    const lr = lane.getBoundingClientRect(), pr = paper.getBoundingClientRect()
    const D = pr.width, radius = D / 2
    const pcx = pr.left + radius - lr.left, pcy = pr.top + radius - lr.top
    const r = score(Math.hypot(x - pcx, y - pcy), radius)

    const id = ++idRef.current
    const jag = Math.floor(Math.random() * JAGS.length)
    if (r.onPaper) {
      const p = { x: (x - pcx) / D, y: (y - pcy) / D }
      setHoles((h) => [...h, { id, x: p.x, y: p.y, onPaper: true, jag }])
      setPts((a) => [...a, p])
    } else {
      setHoles((h) => [...h, { id, x: x / lr.width, y: y / lr.height, onPaper: false, jag }])
    }
    setChips((c) => [{ id, label: r.label, tone: r.tone }, ...c].slice(0, SHOTS_PER_STRING))
    setShots((n) => n + 1)
    if (r.onPaper) {
      setTotal((t) => t + r.val)
      setBest((b) => (b === '—' || r.val > parseFloat(b === 'X' ? '10.9' : b) ? r.label : b))
    }

    fx(x, y, r.label, r.tone)
    if (!muted) sound.shot(r.onPaper)
    recoil.current.y -= 12 + Math.random() * 8
    recoil.current.x += (Math.random() - 0.5) * 10
    if (!reduced.current) lane.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(0)' }], { duration: 110, easing: 'ease-out' })
  }, [complete, cycling, fx, muted, sound])

  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.rl-readout,.rl-top')) return
    const r = laneRef.current!.getBoundingClientRect()
    fire(e.clientX - r.left, e.clientY - r.top)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return
    e.preventDefault()
    const lane = laneRef.current!, paper = paperRef.current!
    const lr = lane.getBoundingClientRect(), pr = paper.getBoundingClientRect()
    const j = () => (Math.random() - 0.5) * pr.width * 0.5 // keyboard "aim" wanders like a real hold
    fire(pr.left + pr.width / 2 - lr.left + j(), pr.top + pr.height / 2 - lr.top + j())
  }

  const onPointerMove = (e: PointerEvent) => {
    const r = laneRef.current!.getBoundingClientRect()
    mouse.current.x = e.clientX - r.left
    mouse.current.y = e.clientY - r.top
    setHideRet(!!(e.target as HTMLElement).closest('.rl-readout,.rl-top'))
  }

  const changeTarget = () => {
    if (cycling) return
    if (!muted) sound.thunk()
    setPhase('down')
    setTimeout(() => {
      setHoles([]); setChips([]); setPts([]); setTotal(0); setBest('—'); setShots(0)
      setPhase('above')
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setPhase('idle')
        setTimeout(() => { if (!muted) sound.thunk() }, 780)
      }))
    }, 560)
  }

  let group = '—'
  if (pts.length >= 2) {
    let g = 0
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) g = Math.max(g, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y))
    group = `${(g * TARGET_MM).toFixed(1)}MM`
  }

  return (
    <div
      ref={laneRef}
      className="rl"
      role="group"
      aria-label="Interactive 10 metre air rifle lane. Click the target, or press Enter, to fire. Ten shots per target."
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHideRet(true)}
    >
      <span className="rl-tick rl-tl" /><span className="rl-tick rl-tr" /><span className="rl-tick rl-bl" /><span className="rl-tick rl-br" />

      <div className="rl-top">
        <span>LANE 04 · 10M AIR RIFLE</span>
        <span className="rl-status" aria-live="polite"><i className={`rl-led${complete ? ' done' : ''}`} />{complete ? 'STRING COMPLETE' : 'READY'}</span>
      </div>

      <div className="rl-backstop">
        <b>BACKSTOP</b>
      </div>
      {holes.filter((h) => !h.onPaper).map((h) => (
        <span key={h.id} className="rl-hole rl-hole-miss" style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%`, '--j': JAGS[h.jag] } as React.CSSProperties} />
      ))}

      <div className={`rl-carrier${phase === 'down' ? ' down' : phase === 'above' ? ' snap' : ''}`}>
        <div ref={paperRef} className="rl-paper">
          <span className="rl-clip" style={{ left: '36%' }} /><span className="rl-clip" style={{ left: '60%' }} />
          <i className="rl-bull" />
          {Array.from({ length: 10 }, (_, k) => k + 1).map((k) => (
            <i key={k} className="rl-ring" style={{ width: `${k * 10}%`, height: `${k * 10}%`, borderColor: k <= 5 ? 'rgba(236,228,210,.5)' : 'rgba(35,31,25,.45)' }} />
          ))}
          <i className="rl-xr" /><i className="rl-cdot" />
          {Array.from({ length: 9 }, (_, i) => i + 1).map((s) => (
            <span key={s} className="rl-num" style={{ top: `${50 - (10.5 - s) * 5}%`, color: s >= 6 ? 'rgba(236,228,210,.78)' : 'rgba(50,44,34,.75)' }}>{s}</span>
          ))}
          {holes.filter((h) => h.onPaper).map((h) => (
            <span key={h.id} className="rl-hole" style={{ left: `${50 + h.x * 100}%`, top: `${50 + h.y * 100}%`, '--j': JAGS[h.jag] } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <p className={`rl-hint${started ? ' off' : ''}`}>CLICK THE TARGET TO FIRE · TEN-SHOT STRING</p>

      <div className="rl-readout">
        <div className="rl-stat"><b>SCORE</b><i className="rl-score">{fmt(total)}</i></div>
        <div className="rl-stat"><b>SHOTS</b><i>{shots}/{SHOTS_PER_STRING}</i></div>
        <div className="rl-stat"><b>GROUP</b><i>{group}</i></div>
        <div className="rl-stat"><b>BEST</b><i>{best}</i></div>
        <div className="rl-chips" aria-hidden="true">
          {chips.map((c) => <span key={c.id} className={`rl-chip rl-c-${c.tone}`}>{c.label}</span>)}
        </div>
        <button type="button" className="rl-btn" onClick={changeTarget} disabled={cycling}>NEW TARGET</button>
        <button type="button" className="rl-btn rl-sfx" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>
      </div>

      <div ref={retRef} className={`rl-reticle${hideRet ? ' hide' : ''}${hot ? ' hot' : ''}`} aria-hidden="true">
        <i className="rl-au" /><i className="rl-ad" /><i className="rl-al" /><i className="rl-ar" />
        <span className="rl-rc" /><span className="rl-cc" />
      </div>
    </div>
  )
}
