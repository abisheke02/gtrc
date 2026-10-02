import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import { inr } from '../../utils/format'
import { StatusBadge } from '../components/StatusBadge'

interface Booking {
  id: string
  createdAt: string
  itemType: string
  itemName: string
  amountInr: number
  status: string
  name: string
  email: string
  phone: string
  participantName: string
  participantAge: number | null
  guardianName: string | null
  preferredDate: string | null
  razorpayPaymentId: string | null
}

const STATUSES = ['', 'PAID', 'PENDING', 'FAILED', 'REFUNDED']

export default function Bookings() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [rows, setRows] = useState<Booking[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setRows(null)
    api<{ bookings: Booking[] }>(`/admin/bookings${status ? `?status=${status}` : ''}`)
      .then((r) => setRows(r.bookings))
      .catch((e) => setError(e.message))
  }, [status])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Bookings & payments</h1>
        <div className="flex items-center gap-3">
          <select className="input !w-auto" value={status} onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
          </select>
          <a href={`${import.meta.env.VITE_API_URL ?? ''}/api/admin/bookings.csv${status ? `?status=${status}` : ''}`} className="whitespace-nowrap text-sm text-gold hover:underline">Export CSV</a>
        </div>
      </div>
      {error && <p className="text-red-300 light:text-red-700">{error}</p>}
      {!rows && !error && <p className="text-mute">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-mute">No bookings yet.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink-2 text-mute">
              <tr>{['Date', 'Item', 'Shooter', 'Contact', 'Amount', 'Status', 'Payment ID'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((b) => (
                <tr key={b.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(b.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-3"><span className="text-xs text-mute">{b.itemType}</span><br />{b.itemName}</td>
                  <td className="px-4 py-3">
                    {b.participantName}{b.participantAge ? ` (${b.participantAge})` : ''}
                    {b.guardianName && <><br /><span className="text-xs text-mute">Guardian: {b.guardianName}</span></>}
                    {b.preferredDate && <><br /><span className="text-xs text-mute">Start: {b.preferredDate.slice(0, 10)}</span></>}
                  </td>
                  <td className="px-4 py-3">{b.name}<br /><a href={`tel:${b.phone}`} className="text-mute hover:text-paper">{b.phone}</a><br /><span className="text-xs text-mute">{b.email}</span></td>
                  <td className="px-4 py-3 font-display">{inr(b.amountInr)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-mute">{b.razorpayPaymentId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
