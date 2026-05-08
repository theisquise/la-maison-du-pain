'use client'

import { useEffect, useState } from 'react'
import { Tag, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'

type PromoCode = { code: string; discountPct: number; description: string; active: boolean }

export default function PromosPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ code: '', discountPct: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/promos').then(r => r.json()).then(d => setCodes(d.codes ?? [])).finally(() => setLoading(false))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.code || !form.discountPct) { setError('Code et remise requis.'); return }
    setSaving(true)
    await fetch('/api/admin/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, discountPct: Number(form.discountPct) }),
    })
    const d = await fetch('/api/admin/promos').then(r => r.json())
    setCodes(d.codes ?? [])
    setForm({ code: '', discountPct: '', description: '' })
    setSaving(false)
  }

  async function handleToggle(code: string, active: boolean) {
    await fetch('/api/admin/promos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, active }),
    })
    setCodes(prev => prev.map(c => c.code === code ? { ...c, active } : c))
  }

  async function handleDelete(code: string) {
    if (!confirm(`Supprimer le code "${code}" ?`)) return
    await fetch('/api/admin/promos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    setCodes(prev => prev.filter(c => c.code !== code))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Codes promo</h1>
        <p className="text-stone-400 text-sm mt-1">{codes.filter(c => c.active).length} code{codes.filter(c => c.active).length > 1 ? 's' : ''} actif{codes.filter(c => c.active).length > 1 ? 's' : ''}</p>
      </div>

      {/* Formulaire ajout */}
      <div className="bg-stone-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Nouveau code</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Code *</label>
            <input
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="EX: ETE2025"
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Remise (%) *</label>
            <input
              type="number" min="1" max="100"
              value={form.discountPct}
              onChange={e => setForm(f => ({ ...f, discountPct: e.target.value }))}
              placeholder="5"
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Description (facultatif)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Newsletter bienvenue"
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          {error && <p className="sm:col-span-3 text-red-400 text-sm">{error}</p>}
          <div className="sm:col-span-3">
            <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Ajout…' : 'Ajouter le code'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="bg-stone-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-500">Chargement…</div>
        ) : codes.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400">Aucun code promo pour l&apos;instant.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-700">
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider">Remise</th>
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="text-left px-6 py-3 text-xs text-stone-400 font-medium uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700">
              {codes.map(c => (
                <tr key={c.code} className="hover:bg-stone-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-amber-400 bg-amber-900/30 px-2 py-1 rounded text-sm">{c.code}</span>
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-semibold">-{c.discountPct}%</td>
                  <td className="px-6 py-4 text-stone-400 text-sm hidden sm:table-cell">{c.description || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggle(c.code, !c.active)} className="flex items-center gap-1.5 text-sm transition-colors">
                      {c.active
                        ? <><ToggleRight className="w-5 h-5 text-green-400" /><span className="text-green-400">Actif</span></>
                        : <><ToggleLeft className="w-5 h-5 text-stone-500" /><span className="text-stone-500">Inactif</span></>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.code)} className="text-stone-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-stone-500 text-xs">Les codes promo ne sont pas cumulables avec les réductions pack ebooks/formations.</p>
    </div>
  )
}
