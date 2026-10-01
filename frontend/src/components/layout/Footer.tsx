import { Link } from 'react-router-dom'
import { nav, site } from '../../content/site'
import { Logo } from './Navbar'

export function Footer() {
  const a = site.address
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-mute">{site.tagline}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">Instagram</a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">Facebook</a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-gold">Explore</h3>
          <ul className="space-y-2 text-sm text-mute">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-paper">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-gold">Visit</h3>
          <address className="text-sm not-italic text-mute">
            {a.street}<br />{a.locality}, {a.city} {a.postalCode}<br />{a.region}
          </address>
          <ul className="mt-4 space-y-1 text-sm text-mute">
            {site.hours.map((h) => <li key={h.days}><span className="text-paper">{h.days}:</span> {h.time}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-gold">Contact</h3>
          <ul className="space-y-2 text-sm text-mute">
            {site.phones.map((p) => <li key={p}><a href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-paper">{p}</a></li>)}
            <li><a href={`mailto:${site.email}`} className="break-all hover:text-paper">{site.email}</a></li>
          </ul>
          <ul className="mt-4 space-y-1 text-xs text-mute">
            <li><Link to="/privacy" className="hover:text-paper">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-paper">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-paper">Refund & Cancellation</Link></li>
            <li><Link to="/safety-rules" className="hover:text-paper">Range Safety Rules</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-mute">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  )
}
