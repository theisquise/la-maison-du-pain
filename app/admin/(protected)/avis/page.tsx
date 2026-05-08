'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Star, MessageSquare, Clock } from 'lucide-react'
import type { Testimonial } from '@/data/testimonials'

const EMPTY: Partial<Testimonial> = {
  name: '',
  role: '',
  avatar: '',
  text: '',
  rating: 5,
  product: '',
  date: '',
}

export default function AdminAvisPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/avis')
    if (res.ok) {
      const data = await res.json()
      setItems(data.testimonials ?? data)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing({ ...EMPTY })
    setIsNew(true)
  }

  function openEdit(t: Testimonial) {
    setEditing({ ...t })
    setIsNew(false)
  }

  function closeModal() {
    setEditing(null)
    setIsNew(false)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/avis' : `/api/admin/avis/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        showToast(isNew ? 'Avis ajouté !' : 'Avis mis à jour !')
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
    const res = await fetch(`/api/admin/avis/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Avis supprimé')
      setDeleteId(null)
      load()
    } else {
      showToast('Erreur lors de la suppression', false)
    }
  }

  async function handleApprove(id: string) {
    const res = await fetch(`/api/admin/avis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pending: false }),
    })
    if (res.ok) {
      showToast('Avis publié !')
      load()
    } else {
      showToast('Erreur', false)
    }
  }

  function set(field: keyof Testimonial, value: unknown) {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev)
  }

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
          <h1 className="text-2xl font-bold text-stone-800">Témoignages</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} avis client{items.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Ajouter un avis
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-400">Chargement…</div>
      ) : (
        <>
          {/* Avis en attente de modération */}
          {items.filter((t) => t.pending).length > 0 && (
            <div className="mb-8">
              <h2 className="flex items-center gap-2 text-base font-semibold text-orange-400 mb-3">
                <Clock size={16} /> En attente de modération ({items.filter((t) => t.pending).length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.filter((t) => t.pending).map((t) => (
                  <div key={t.id} className="bg-orange-950/30 border border-orange-800/40 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-white text-sm">{t.name}</p>
                        <div className="flex mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={11} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-600 fill-stone-600'} />
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {t.product && <p className="text-xs text-stone-400 mb-1">Produit : {t.product}</p>}
                    <p className="text-sm text-stone-300 italic mb-4">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(t.id)}
                        className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        <Check size={13} /> Publier
                      </button>
                      <button
                        onClick={() => setDeleteId(t.id)}
                        className="flex items-center gap-1.5 bg-stone-700 hover:bg-red-900 text-stone-300 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        <Trash2 size={13} /> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avis publiés */}
          {items.filter((t) => !t.pending).length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun témoignage publié</p>
            </div>
          ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.filter((t) => !t.pending).map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-stone-800 text-sm">{t.name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'} />
                      ))}
                    </div>
                  </div>
                  {t.role && <p className="text-xs text-stone-400 mb-2">{t.role}</p>}
                  <p className="text-sm text-stone-600 line-clamp-3 italic">"{t.text}"</p>
                  {t.product && <p className="text-xs text-stone-400 mt-2">Produit : {t.product}</p>}
                  {t.date && <p className="text-xs text-stone-400">{t.date}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-semibold text-stone-800">{isNew ? 'Nouveau témoignage' : 'Modifier le témoignage'}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 p-1 rounded"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Nom *</label>
                <input
                  type="text"
                  value={editing.name ?? ''}
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Rôle / Titre</label>
                <input
                  type="text"
                  value={editing.role ?? ''}
                  onChange={(e) => set('role', e.target.value)}
                  placeholder="ex : Cliente fidèle"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Note (1–5)</label>
                <select
                  value={String(editing.rating ?? 5)}
                  onChange={(e) => set('rating', Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Date (ex : Janvier 2025)</label>
                <input
                  type="text"
                  value={editing.date ?? ''}
                  onChange={(e) => set('date', e.target.value)}
                  placeholder="Janvier 2025"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-600 mb-1">Texte *</label>
                <textarea
                  value={editing.text ?? ''}
                  onChange={(e) => set('text', e.target.value)}
                  rows={4}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Produit mentionné</label>
                <input
                  type="text"
                  value={editing.product ?? ''}
                  onChange={(e) => set('product', e.target.value)}
                  placeholder="ex : Croissant au Beurre"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">URL avatar</label>
                <input
                  type="text"
                  value={editing.avatar ?? ''}
                  onChange={(e) => set('avatar', e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-stone-100">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors">Annuler</button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name?.trim() || !editing.text?.trim()}
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
            <h2 className="font-semibold text-stone-800 mb-2">Supprimer cet avis ?</h2>
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
