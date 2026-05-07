'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

interface Stats {
  products: { total: number; inStock: number; outOfStock: number; bestsellers: number }
  formations: { total: number; videos: number; ebooks: number }
  testimonials: { total: number; avgRating: string }
  system: { stripeConfigured: boolean; webhookConfigured: boolean; adminPasswordSet: boolean }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Tableau de bord</h1>
        <p className="text-stone-500 mt-1">Vue d'ensemble de votre boulangerie en ligne</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Produits"
          value={stats?.products.total}
          sub={stats ? `${stats.products.inStock} en stock · ${stats.products.bestsellers} bestsellers` : ''}
          href="/admin/produits"
          color="amber"
        />
        <StatCard
          icon={GraduationCap}
          label="Formations & Ebooks"
          value={stats?.formations.total}
          sub={stats ? `${stats.formations.videos} vidéos · ${stats.formations.ebooks} ebooks` : ''}
          href="/admin/formations"
          color="sky"
        />
        <StatCard
          icon={MessageSquare}
          label="Témoignages"
          value={stats?.testimonials.total}
          sub={stats ? `Note moyenne : ${stats.testimonials.avgRating}/5` : ''}
          href="/admin/avis"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-700 mb-4">Actions rapides</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/produits', label: 'Gérer les produits', icon: ShoppingBag },
              { href: '/admin/formations', label: 'Gérer les formations', icon: GraduationCap },
              { href: '/admin/avis', label: 'Gérer les témoignages', icon: MessageSquare },
              { href: '/admin/config', label: 'Modifier la configuration', icon: TrendingUp },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group"
              >
                <div className="flex items-center gap-3 text-stone-600">
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </div>
                <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Statut système */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-700 mb-4">Statut du système</h2>
          <div className="space-y-3">
            <SystemStatus
              label="Mot de passe admin"
              ok={stats?.system.adminPasswordSet ?? null}
              okText="Défini dans .env.local"
              koText="Utilisez ADMIN_PASSWORD dans .env.local"
            />
            <SystemStatus
              label="Stripe (paiements)"
              ok={stats?.system.stripeConfigured ?? null}
              okText="Clé API configurée"
              koText="Ajoutez STRIPE_SECRET_KEY dans .env.local"
            />
            <SystemStatus
              label="Webhook Stripe"
              ok={stats?.system.webhookConfigured ?? null}
              okText="Webhook configuré"
              koText="Ajoutez STRIPE_WEBHOOK_SECRET dans .env.local"
            />
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100">
            <a
              href="/"
              target="_blank"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              Voir le site public <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number | undefined
  sub: string
  href: string
  color: 'amber' | 'sky' | 'emerald'
}) {
  const colors = {
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-md transition-shadow group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-3xl font-bold text-stone-800 mb-0.5">
        {value ?? <span className="text-stone-300 text-2xl">—</span>}
      </p>
      <p className="text-sm font-medium text-stone-600 mb-1">{label}</p>
      {sub && <p className="text-xs text-stone-400">{sub}</p>}
    </Link>
  )
}

function SystemStatus({
  label,
  ok,
  okText,
  koText,
}: {
  label: string
  ok: boolean | null
  okText: string
  koText: string
}) {
  return (
    <div className="flex items-start gap-3">
      {ok === null ? (
        <div className="w-5 h-5 rounded-full bg-stone-100 mt-0.5 animate-pulse shrink-0" />
      ) : ok ? (
        <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
      ) : (
        <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
      )}
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        <p className="text-xs text-stone-400">{ok ? okText : koText}</p>
      </div>
    </div>
  )
}
