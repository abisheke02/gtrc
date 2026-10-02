import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import { inr } from '../../utils/format'
import { StatusBadge } from '../components/StatusBadge'

interface Donation {
  id: string
  createdAt: string
  amountInr: number
  status: string
  purpose: string
  name: string
  email: string
  phone: string
  pan: string | null
  address: string | null
  message: string | null
  anonymous: boolean
  razorpayPaymentId: string | null
}

const STATUSES = ['', 'PAID', 'PENDING', 'FAILED', 'REFUNDED']

export default function Donations() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [rows, setRows] = useState<Donation[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setRows(null)
    api<{ donations: Donation[] }>(`/admin/donations${status ? `?status=${status}` : ''}`)
      .then((r) => setRows(r.donations))
      .catch((e) => setError(e.message))
  }, [status])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Donations</h1>
        <div className="flex items-center gap-3">
          <select className="input !w-auto" value={status} onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
          </select>
          <a href={`${import.meta.env.VITE_API_URL ?? ''}/api/admin/donations.csv${status ? `?status=${status}` : ''}`} className="whitespace-nowrap text-sm text-gold hover:underline">Export CSV</a>
        </div>
      </div>
      {error && <p className="text-red-300 light:text-red-700">{error}</p>}
      {!rows && !error && <p className="text-mute">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-mute">No donations yet.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink-2 text-mute">
              <tr>{['Date', 'Donor', 'Contact', 'Purpose', 'Amount', 'Status', '80G details', 'Payment ID'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((d) => (
                <tr key={d.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(d.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-3">{d.name}{d.anonymous && <><br /><span className="text-xs text-mute">Keep private</span></>}{d.message && <><br /><span className="text-xs text-mute">“{d.message}”</span></>}</td>
                  <td className="px-4 py-3"><a href={`tel:${d.phone}`} className="text-mute hover:text-paper">{d.phone}</a><br /><span className="text-xs text-mute">{d.email}</span></td>
                  <td className="px-4 py-3">{d.purpose}</td>
                  <td className="px-4 py-3 font-display">{inr(d.amountInr)}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 text-xs text-mute">{d.pan ? <>{d.pan}<br />{d.address}</> : '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-mute">{d.razorpayPaymentId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
