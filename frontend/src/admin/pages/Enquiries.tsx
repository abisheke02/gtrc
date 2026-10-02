import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { StatusBadge } from '../components/StatusBadge'

interface Enquiry { id: string; createdAt: string; name: string; phone: string; email: string | null; subject: string | null; message: string; status: string }

export default function Enquiries() {
  const [rows, setRows] = useState<Enquiry[] | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api<{ enquiries: Enquiry[] }>('/admin/enquiries').then((r) => setRows(r.enquiries)).catch((e) => setError(e.message)) }, [])

  async function setStatus(id: string, status: string) {
    try {
      await api(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      setRows((r) => r?.map((x) => (x.id === id ? { ...x, status } : x)) ?? null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl">Enquiries</h1>
      {error && <p className="mb-4 text-red-300 light:text-red-700">{error}</p>}
      {!rows && !error && <p className="text-mute">Loading…</p>}
      {rows?.length === 0 && <p className="text-mute">No enquiries yet.</p>}
      <div className="space-y-4">
        {rows?.map((q) => (
          <article key={q.id} className="rounded-xl border border-line bg-ink-2 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{q.name} <span className="text-sm text-mute">· {q.subject}</span></p>
                <p className="text-sm text-mute">
                  <a href={`tel:${q.phone}`} className="hover:text-paper">{q.phone}</a>{q.email && <> · {q.email}</>} · {new Date(q.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={q.status} />
                <select className="input !w-auto !py-1 text-xs" value={q.status} onChange={(e) => setStatus(q.id, e.target.value)} aria-label="Change status">
                  <option>NEW</option><option>CONTACTED</option><option>CLOSED</option>
                </select>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-paper/90">{q.message}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
