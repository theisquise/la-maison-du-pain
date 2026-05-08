'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Impossible d\'envoyer le message. Vérifiez votre connexion.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-green-800 mb-1">Message envoyé !</p>
          <p className="text-green-700 text-sm">
            Merci {form.name}, nous vous répondrons sous 24h. Un email de confirmation vous a été envoyé.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom complet *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Jean Dupont"
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="jean@email.fr"
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Sujet *</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="input-base"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="commande">Question sur une commande</option>
          <option value="formation">Informations sur une formation</option>
          <option value="ebook">Question sur un ebook</option>
          <option value="produit">Question produit</option>
          <option value="partenariat">Partenariat</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Message *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Décrivez votre demande..."
          className="input-base resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === 'loading' ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {status === 'loading' ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>
    </form>
  )
}
