'use client'

import { useEffect, useState } from 'react'
import { Check, AlertCircle, Save } from 'lucide-react'
import type { SiteConfigData } from '@/lib/admin-data'

export default function AdminConfigPage() {
  const [data, setData] = useState<SiteConfigData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!data) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) showToast('Configuration sauvegardée !')
      else showToast('Erreur lors de la sauvegarde', false)
    } finally {
      setSaving(false)
    }
  }

  function setSiteConfig(path: string[], value: string) {
    setData((prev) => {
      if (!prev) return prev
      const next = JSON.parse(JSON.stringify(prev)) as SiteConfigData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next.siteConfig
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]]
      obj[path[path.length - 1]] = value
      return next
    })
  }

  if (loading) {
    return <div className="p-8 text-stone-400">Chargement…</div>
  }

  if (!data) {
    return <div className="p-8 text-red-500">Erreur de chargement de la configuration.</div>
  }

  const { siteConfig: c } = data

  return (
    <div className="p-8 max-w-3xl">
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
          <h1 className="text-2xl font-bold text-stone-800">Configuration du site</h1>
          <p className="text-stone-500 text-sm mt-0.5">Modifiez les textes et informations du site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={15} />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Identité */}
        <Section title="Identité du site">
          <Field label="Nom du site" value={c.name} onChange={(v) => setSiteConfig(['name'], v)} />
          <Field label="Slogan" value={c.tagline} onChange={(v) => setSiteConfig(['tagline'], v)} />
          <Field label="Description (SEO)" value={c.description} onChange={(v) => setSiteConfig(['description'], v)} textarea />
        </Section>

        {/* Coordonnées */}
        <Section title="Coordonnées">
          <Field label="Adresse" value={c.contact.address} onChange={(v) => setSiteConfig(['contact', 'address'], v)} />
          <Field label="Téléphone" value={c.contact.phone} onChange={(v) => setSiteConfig(['contact', 'phone'], v)} />
          <Field label="Email" value={c.contact.email} onChange={(v) => setSiteConfig(['contact', 'email'], v)} />
        </Section>

        {/* Horaires */}
        <Section title="Horaires d'ouverture">
          {(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const).map((day) => (
            <Field
              key={day}
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              value={(c.hours as Record<string, string>)[day] ?? ''}
              onChange={(v) => setSiteConfig(['hours', day], v)}
            />
          ))}
        </Section>

        {/* Réseaux sociaux */}
        <Section title="Réseaux sociaux">
          <Field label="Facebook" value={c.social.facebook} onChange={(v) => setSiteConfig(['social', 'facebook'], v)} placeholder="https://facebook.com/…" />
          <Field label="Instagram" value={c.social.instagram} onChange={(v) => setSiteConfig(['social', 'instagram'], v)} placeholder="https://instagram.com/…" />
          <Field label="TikTok" value={c.social.tiktok} onChange={(v) => setSiteConfig(['social', 'tiktok'], v)} placeholder="https://tiktok.com/…" />
          <Field label="YouTube" value={c.social.youtube} onChange={(v) => setSiteConfig(['social', 'youtube'], v)} placeholder="https://youtube.com/…" />
          <Field label="Twitter / X" value={c.social.twitter} onChange={(v) => setSiteConfig(['social', 'twitter'], v)} placeholder="https://twitter.com/…" />
        </Section>

        {/* Héro */}
        <Section title="Section Héro (page d'accueil)">
          <Field label="Titre principal" value={c.hero.heading} onChange={(v) => setSiteConfig(['hero', 'heading'], v)} />
          <Field label="Sous-titre" value={c.hero.subheading} onChange={(v) => setSiteConfig(['hero', 'subheading'], v)} />
          <Field label="Texte du badge rotatif" value={c.hero.badgeText} onChange={(v) => setSiteConfig(['hero', 'badgeText'], v)} />
          <Field label="Texte du bouton" value={c.hero.ctaText} onChange={(v) => setSiteConfig(['hero', 'ctaText'], v)} />
          <Field label="Lien du bouton" value={c.hero.ctaLink} onChange={(v) => setSiteConfig(['hero', 'ctaLink'], v)} />
          <Field label="URL de l'image" value={c.hero.image} onChange={(v) => setSiteConfig(['hero', 'image'], v)} placeholder="https://…" />
        </Section>

        {/* Section Tradition */}
        <Section title="Section Tradition">
          <Field label="Titre" value={c.tradition.heading} onChange={(v) => setSiteConfig(['tradition', 'heading'], v)} />
          <Field label="Texte" value={c.tradition.text} onChange={(v) => setSiteConfig(['tradition', 'text'], v)} textarea />
          <Field label="Texte du bouton" value={c.tradition.ctaText} onChange={(v) => setSiteConfig(['tradition', 'ctaText'], v)} />
          <Field label="URL de l'image" value={c.tradition.image} onChange={(v) => setSiteConfig(['tradition', 'image'], v)} placeholder="https://…" />
        </Section>

        {/* Section Cookies */}
        <Section title="Section Cookies">
          <Field label="Titre" value={c.darkSection.heading} onChange={(v) => setSiteConfig(['darkSection', 'heading'], v)} />
          <Field label="Texte" value={c.darkSection.text} onChange={(v) => setSiteConfig(['darkSection', 'text'], v)} textarea />
          <Field label="Prix affiché" value={c.darkSection.price} onChange={(v) => setSiteConfig(['darkSection', 'price'], v)} placeholder="ex : 5,90 €" />
          <Field label="Texte du bouton" value={c.darkSection.ctaText} onChange={(v) => setSiteConfig(['darkSection', 'ctaText'], v)} />
          <Field label="URL de l'image" value={c.darkSection.image} onChange={(v) => setSiteConfig(['darkSection', 'image'], v)} placeholder="https://…" />
        </Section>

        {/* Newsletter */}
        <Section title="Newsletter">
          <Field label="Titre" value={c.newsletter.heading} onChange={(v) => setSiteConfig(['newsletter', 'heading'], v)} />
          <Field label="Sous-titre" value={c.newsletter.subheading} onChange={(v) => setSiteConfig(['newsletter', 'subheading'], v)} />
          <Field label="Placeholder email" value={c.newsletter.placeholder} onChange={(v) => setSiteConfig(['newsletter', 'placeholder'], v)} />
          <Field label="Texte du bouton" value={c.newsletter.ctaText} onChange={(v) => setSiteConfig(['newsletter', 'ctaText'], v)} />
        </Section>

        {/* Footer */}
        <Section title="Footer">
          <Field label="Texte de copyright" value={c.footer.copyright} onChange={(v) => setSiteConfig(['footer', 'copyright'], v)} />
          <Field label="Texte paiement sécurisé" value={c.footer.paymentText} onChange={(v) => setSiteConfig(['footer', 'paymentText'], v)} />
        </Section>
      </div>

      {/* Bouton flottant bas */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg"
        >
          <Save size={16} />
          {saving ? 'Enregistrement…' : 'Tout enregistrer'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200">
        <h2 className="font-semibold text-stone-700 text-sm">{title}</h2>
      </div>
      <div className="p-5 grid grid-cols-1 gap-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder = '',
  textarea = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
