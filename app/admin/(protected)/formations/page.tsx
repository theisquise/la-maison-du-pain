'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, BookOpen } from 'lucide-react'
import type { Formation } from '@/data/formations'

const EMPTY: Partial<Formation> = {
  type: 'formation',
  name: '',
  shortDescription: '',
  longDescription: '',
  price: 0,
  originalPrice: undefined,
  image: '',
  level: 'débutant',
  duration: '',
  pages: undefined,
  includes: [],
  rating: 5,
  reviewCount: 0,
  bestseller: false,
  stripeProductId: '',
  downloadUrl: '',
}

const LEVELS = [
  { id: 'débutant', label: 'Débutant' },
  { id: 'intermédiaire', label: 'Intermédiaire' },
  { id: 'avancé', label: 'Avancé' },
]

export default function AdminFormationsPage() {
  const [items, setItems] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Formation> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [includesText, setIncludesText] = useState('')

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/formations')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    const draft = { ...EMPTY }
    setEditing(draft)
    setIsNew(true)
    setIncludesText('')
  }

  function openEdit(f: Formation) {
    setEditing({ ...f })
    setIsNew(false)
    setIncludesText(f.includes.join('\n'))
  }

  function closeModal() {
    setEditing(null)
    setIsNew(false)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const payload = {
        ...editing,
        includes: includesText.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      const url = isNew ? '/api/admin/formations' : `/api/admin/formations/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        showToast(isNew ? 'Formation ajoutée !' : 'Formation mise à jour !')
        closeModal()
        load()
      } else {
        const err = await res.json()
        showToast(err.error ?? 'Erreur', false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/formations/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Formation supprimée')
      setDeleteId(null)
      load()
    } else {
      showToast('Erreur lors de la suppression', false)
    }
  }

  function set(field: keyof Formation, value: unknown) {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const videos = items.filter((f) => f.type === 'formation')
  const ebooks = items.filter((f) => f.type === 'ebook')

  return (
    <div className="p-8">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.ok ? <Check size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Formations & Ebooks</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {videos.length} formation{videos.length > 1 ? 's' : ''} vidéo · {ebooks.length} ebook{ebooks.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-400">Chargement…</div>
      ) : (
        <>
          {videos.length > 0 && (
            <Section title="Formations vidéo" items={videos} onEdit={openEdit} onDelete={setDeleteId} />
          )}
          {ebooks.length > 0 && (
            <Section title="Ebooks PDF" items={ebooks} onEdit={openEdit} onDelete={setDeleteId} />
          )}
          {items.length === 0 && (
            <div className="py-16 text-center text-stone-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucune formation</p>
            </div>
          )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-semibold text-stone-800">{isNew ? 'Nouvelle formation/ebook' : 'Modifier'}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 p-1 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <select
                  value={editing.type ?? 'formation'}
                  onChange={(e) => set('type', e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                >
                  <option value="formation">Formation vidéo</option>
                  <option value="ebook">Ebook PDF</option>
                </select>
              </div>
              <div>
                <Label>Niveau *</Label>
                <select
                  value={editing.level ?? 'débutant'}
                  onChange={(e) => set('level', e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                >
                  {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>Nom *</Label>
                <input
                  type="text"
                  value={editing.name ?? ''}
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Description courte</Label>
                <input
                  type="text"
                  value={editing.shortDescription ?? ''}
                  onChange={(e) => set('shortDescription', e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Description longue</Label>
                <textarea
                  value={editing.longDescription ?? ''}
                  onChange={(e) => set('longDescription', e.target.value)}
                  rows={3}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
                />
              </div>
              <div>
                <Label>Prix (€) *</Label>
                <input
                  type="number"
                  value={String(editing.price ?? 0)}
                  onChange={(e) => set('price', e.target.value)}
                  step="0.01"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div>
                <Label>Prix original barré (€)</Label>
                <input
                  type="number"
                  value={String(editing.originalPrice ?? '')}
                  onChange={(e) => set('originalPrice', e.target.value || undefined)}
                  step="0.01"
                  placeholder="Optionnel"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Image URL</Label>
                <input
                  type="text"
                  value={editing.image ?? ''}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              {editing.type === 'formation' ? (
                <div>
                  <Label>Durée (ex : 12h de vidéos HD)</Label>
                  <input
                    type="text"
                    value={editing.duration ?? ''}
                    onChange={(e) => set('duration', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              ) : (
                <div>
                  <Label>Nombre de pages</Label>
                  <input
                    type="number"
                    value={String(editing.pages ?? '')}
                    onChange={(e) => set('pages', e.target.value || undefined)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              )}
              <div>
                <Label>Note (1–5)</Label>
                <input
                  type="number"
                  value={String(editing.rating ?? 5)}
                  onChange={(e) => set('rating', e.target.value)}
                  min="1" max="5" step="0.1"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Ce qui est inclus (une ligne par élément)</Label>
                <textarea
                  value={includesText}
                  onChange={(e) => setIncludesText(e.target.value)}
                  rows={4}
                  placeholder={"8h de vidéos HD\nFiches recettes PDF\nAccès à vie"}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>ID Stripe (price_…)</Label>
                <input
                  type="text"
                  value={editing.stripeProductId ?? ''}
                  onChange={(e) => set('stripeProductId', e.target.value)}
                  placeholder="price_…"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              {editing.type === 'ebook' && (
                <div className="sm:col-span-2">
                  <Label>URL de téléchargement (après paiement)</Label>
                  <input
                    type="text"
                    value={editing.downloadUrl ?? ''}
                    onChange={(e) => set('downloadUrl', e.target.value)}
                    placeholder="https://drive.google.com/…"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={editing.bestseller ?? false}
                  onChange={(e) => set('bestseller', e.target.checked)}
                  className="w-4 h-4 accent-amber-600"
                />
                Bestseller
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-stone-100">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name?.trim()}
                className="px-5 py-2 rounded-lg text-sm bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-medium transition-colors"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="font-semibold text-stone-800 mb-2">Supprimer ?</h2>
            <p className="text-stone-600 text-sm mb-5">Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="px-5 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  items,
  onEdit,
  onDelete,
}: {
  title: string
  items: Formation[]
  onEdit: (f: Formation) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">{title}</h2>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Nom</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Niveau</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Prix</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Bestseller</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((f, i) => (
              <tr key={f.id} className={`border-b border-stone-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}>
                <td className="px-5 py-3.5 font-medium text-stone-800">{f.name}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-block bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full capitalize">
                    {f.level}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-medium text-stone-700">
                  {f.price.toFixed(2).replace('.', ',')} €
                  {f.originalPrice && (
                    <span className="text-stone-400 text-xs line-through ml-2">
                      {f.originalPrice.toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {f.bestseller && <span className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">⭐ Bestseller</span>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => onEdit(f)} className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(f.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-stone-600 mb-1">{children}</label>
}
