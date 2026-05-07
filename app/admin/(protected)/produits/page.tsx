'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, PackageX } from 'lucide-react'
import type { Product } from '@/data/products'

const EMPTY: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  category: 'pain',
  image: '',
  rating: 5,
  reviewCount: 0,
  inStock: true,
  bestseller: false,
  stripeProductId: '',
}

const CATEGORIES = [
  { id: 'pain', label: 'Pains' },
  { id: 'viennoiserie', label: 'Viennoiseries' },
  { id: 'patisserie', label: 'Pâtisseries' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'special', label: 'Coffrets' },
]

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
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
    const res = await fetch('/api/admin/produits')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing({ ...EMPTY })
    setIsNew(true)
  }

  function openEdit(p: Product) {
    setEditing({ ...p })
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
      const url = isNew ? '/api/admin/produits' : `/api/admin/produits/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        showToast(isNew ? 'Produit ajouté !' : 'Produit mis à jour !')
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
    const res = await fetch(`/api/admin/produits/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Produit supprimé')
      setDeleteId(null)
      load()
    } else {
      showToast('Erreur lors de la suppression', false)
    }
  }

  function set(field: keyof Product, value: unknown) {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.ok ? <Check size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Produits</h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Ajouter un produit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-stone-400">Chargement…</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <PackageX size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun produit</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Nom</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Catégorie</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Prix</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">Bestseller</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={`border-b border-stone-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}>
                  <td className="px-5 py-3.5 font-medium text-stone-800">{p.name}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full capitalize">
                      {CATEGORIES.find((c) => c.id === p.category)?.label ?? p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-700 font-medium">
                    {p.price.toFixed(2).replace('.', ',')} €
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {p.inStock ? '● En stock' : '● Rupture'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {p.bestseller && (
                      <span className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">⭐ Bestseller</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal édition */}
      {editing && (
        <Modal title={isNew ? 'Nouveau produit' : 'Modifier le produit'} onClose={closeModal}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Nom *</Label>
              <Input value={editing.name ?? ''} onChange={(v) => set('name', v)} placeholder="ex : Croissant au Beurre" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description *</Label>
              <Textarea value={editing.description ?? ''} onChange={(v) => set('description', v)} rows={2} />
            </div>
            <div>
              <Label>Prix (€) *</Label>
              <Input type="number" value={String(editing.price ?? 0)} onChange={(v) => set('price', v)} step="0.01" />
            </div>
            <div>
              <Label>Catégorie *</Label>
              <Select value={editing.category ?? 'pain'} onChange={(v) => set('category', v)} options={CATEGORIES} />
            </div>
            <div className="sm:col-span-2">
              <Label>Image URL</Label>
              <Input value={editing.image ?? ''} onChange={(v) => set('image', v)} placeholder="https://..." />
            </div>
            <div>
              <Label>Note (1–5)</Label>
              <Input type="number" value={String(editing.rating ?? 5)} onChange={(v) => set('rating', v)} min="1" max="5" step="0.1" />
            </div>
            <div>
              <Label>Nombre d'avis</Label>
              <Input type="number" value={String(editing.reviewCount ?? 0)} onChange={(v) => set('reviewCount', v)} min="0" />
            </div>
            <div className="sm:col-span-2">
              <Label>ID Stripe (price_…)</Label>
              <Input value={editing.stripeProductId ?? ''} onChange={(v) => set('stripeProductId', v)} placeholder="price_…" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="inStock"
                checked={editing.inStock ?? true}
                onChange={(v) => set('inStock', v)}
                label="En stock"
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="bestseller"
                checked={editing.bestseller ?? false}
                onChange={(v) => set('bestseller', v)}
                label="Bestseller"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-stone-100">
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
        </Modal>
      )}

      {/* Confirm suppression */}
      {deleteId && (
        <Modal title="Supprimer le produit ?" onClose={() => setDeleteId(null)} small>
          <p className="text-stone-600 text-sm mb-5">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors">
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteId)}
              className="px-5 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- Composants réutilisables ---

function Modal({ title, onClose, children, small }: {
  title: string
  onClose: () => void
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${small ? 'max-w-sm' : 'max-w-xl'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-stone-600 mb-1">{children}</label>
}

function Input({ value, onChange, type = 'text', placeholder = '', step, min, max }: {
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  step?: string
  min?: string
  max?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
    />
  )
}

function Select({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
    >
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  )
}

function Checkbox({ id, checked, onChange, label }: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-amber-600 rounded"
      />
      {label}
    </label>
  )
}
