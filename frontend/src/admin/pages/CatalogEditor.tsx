import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import type { ItemType } from '../../types'

interface Row { type: ItemType; slug: string; name: string; priceInr: number; active: boolean }

export default function CatalogEditor() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { api<{ items: Row[] }>('/admin/catalog').then((r) => setRows(r.items)).catch((e) => setError(e.message)) }, [])

  const update = (i: number, patch: Partial<Row>) => setRows((r) => r?.map((x, j) => (j === i ? { ...x, ...patch } : x)) ?? null)

  async function save(row: Row) {
    setMsg('')
    setError('')
    try {
      await api(`/admin/catalog/${row.type}/${row.slug}`, { method: 'PATCH', body: JSON.stringify({ name: row.name, priceInr: row.priceInr, active: row.active }) })
      setMsg(`Saved “${row.name}”`)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl">Programmes & fees</h1>
      <p className="mb-6 text-sm text-mute">Changes go live on the website straight away. Prices are in rupees; online payments always use the price saved here.</p>
      {msg && <p className="mb-4 text-sm text-green-300" role="status">{msg}</p>}
      {error && <p className="mb-4 text-sm text-red-300" role="alert">{error}</p>}
      {!rows && !error && <p className="text-mute">Loading…</p>}
      {rows && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-2 text-mute"><tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Price (₹)</th><th className="px-4 py-3">Active</th><th /></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((r, i) => (
                <tr key={`${r.type}:${r.slug}`}>
                  <td className="px-4 py-2 text-xs text-mute">{r.type}</td>
                  <td className="px-4 py-2"><input className="input !py-1.5" value={r.name} onChange={(e) => update(i, { name: e.target.value })} /></td>
                  <td className="px-4 py-2"><input className="input !w-28 !py-1.5" type="number" min={1} value={r.priceInr} onChange={(e) => update(i, { priceInr: Number(e.target.value) })} /></td>
                  <td className="px-4 py-2"><input type="checkbox" checked={r.active} onChange={(e) => update(i, { active: e.target.checked })} className="accent-[var(--color-gold)]" /></td>
                  <td className="px-4 py-2"><button onClick={() => save(r)} className="text-gold hover:underline">Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
