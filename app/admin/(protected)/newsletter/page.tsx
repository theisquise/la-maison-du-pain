'use client'

import { useEffect, useState } from 'react'
import { Mail, Trash2, Download } from 'lucide-react'

type Subscriber = { id: string; email: string; createdAt: string }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet abonné ?')) return
    await fetch('/api/admin/newsletter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
  }

  function exportCSV() {
    const rows = ['Email,Date inscription', ...subscribers.map((s) => `${s.email},${s.createdAt}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-stone-400 text-sm mt-1">{subscribers.length} abonné{subscribers.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="bg-stone-800 rounded-xl p-4">
        <input
          type="text"
          placeholder="Rechercher un email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-stone-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-500">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400">
              {search ? 'Aucun résultat.' : 'Aucun abonné pour l\'instant.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-700">
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider">Inscrit le</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-stone-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">{s.email}</td>
                  <td className="px-6 py-4 text-sm text-stone-400">{formatDate(s.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
