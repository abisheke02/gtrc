import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav, site } from '../../content/site'
import { Button } from '../common/Button'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name}, home`}>
      <img src="/favicon.svg" alt="" className="h-9 w-9" />
      <span className="font-display leading-tight uppercase">
        <span className="block text-base tracking-wider text-gold">Golden Trigger</span>
        <span className="block text-[11px] tracking-[0.3em] text-mute">Rifle Club</span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `font-display text-sm uppercase tracking-wider transition-colors ${isActive ? 'text-gold' : 'text-paper/80 hover:text-gold'}`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {nav.slice(1).map((n) => <NavLink key={n.to} to={n.to} className={linkCls}>{n.label}</NavLink>)}
          <Button to="/book">Book Now</Button>
        </nav>
        <button
          className="rounded p-2 text-paper lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-line bg-ink-2 lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col gap-4 py-5">
            {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkCls} onClick={() => setOpen(false)} end>{n.label}</NavLink>)}
            <Button to="/book" className="w-full">Book Now</Button>
          </div>
        </nav>
      )}
    </header>
  )
}
