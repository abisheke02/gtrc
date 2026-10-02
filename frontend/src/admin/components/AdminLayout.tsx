import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Seo } from '../../components/seo/Seo'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings & Payments' },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/catalog', label: 'Programmes & Fees' },
]

export function AdminLayout() {
  const { admin, loading, logout } = useAuth()
  if (loading) return <div className="p-10 text-mute">Loading…</div>
  if (!admin) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-ink">
      <Seo title="Admin" path="/admin" noindex />
      <header className="border-b border-line bg-ink-2">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="font-display uppercase tracking-wider text-gold">GTRC Admin</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-mute sm:inline">{admin.email}</span>
            <a href="/" className="text-mute hover:text-paper">View site</a>
            <button onClick={logout} className="text-gold hover:text-gold-2">Log out</button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 sm:px-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm ${isActive ? 'border-gold text-gold' : 'border-transparent text-mute hover:text-paper'}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  )
}
