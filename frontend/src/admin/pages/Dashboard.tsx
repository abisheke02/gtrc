import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { inr } from '../../utils/format'

interface Stats {
  revenueToday: number
  revenueMonth: number
  paidBookingsMonth: number
  pendingBookings: number
  newEnquiries: number
  donationsMonth: number
  donationsCountMonth: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api<Stats>('/admin/stats').then(setStats).catch((e) => setError(e.message)) }, [])

  if (error) return <p className="text-red-300 light:text-red-700">{error}</p>
  if (!stats) return <p className="text-mute">Loading…</p>

  const cards = [
    { label: 'Revenue today', value: inr(stats.revenueToday) },
    { label: 'Revenue this month', value: inr(stats.revenueMonth) },
    { label: 'Paid bookings this month', value: stats.paidBookingsMonth, to: '/admin/bookings?status=PAID' },
    { label: 'Pending payments', value: stats.pendingBookings, to: '/admin/bookings?status=PENDING' },
    { label: `Donations this month (${stats.donationsCountMonth})`, value: inr(stats.donationsMonth), to: '/admin/donations?status=PAID' },
    { label: 'New enquiries', value: stats.newEnquiries, to: '/admin/enquiries' },
  ]
  return (
    <div>
      <h1 className="mb-6 text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const inner = (
            <>
              <p className="text-sm text-mute">{c.label}</p>
              <p className="mt-2 font-display text-3xl">{c.value}</p>
            </>
          )
          return c.to
            ? <Link key={c.label} to={c.to} className="rounded-xl border border-line bg-ink-2 p-5 hover:border-gold">{inner}</Link>
            : <div key={c.label} className="rounded-xl border border-line bg-ink-2 p-5">{inner}</div>
        })}
      </div>
    </div>
  )
}
