const colors: Record<string, string> = {
  PAID: 'bg-green-500/15 text-green-300 light:text-green-700',
  PENDING: 'bg-yellow-500/15 text-yellow-300 light:text-yellow-700',
  FAILED: 'bg-red-500/15 text-red-300 light:text-red-700',
  REFUNDED: 'bg-blue-500/15 text-blue-300 light:text-blue-700',
  NEW: 'bg-gold/20 text-gold',
  CONTACTED: 'bg-blue-500/15 text-blue-300 light:text-blue-700',
  CLOSED: 'bg-ink-3 text-mute',
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${colors[status] ?? 'bg-ink-3 text-mute'}`}>{status}</span>
}
