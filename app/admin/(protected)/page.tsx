'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, GraduationCap, MessageSquare, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, Users, Package, Euro, Clock, ArrowRight, Star,
} from 'lucide-react'

type MonthData = { label: string; revenue: number; count: number }
type TopProduct = { id: string; name: string; type: string; revenue: number; count: number }
type RecentOrder = {
  id: string; orderNumber: string; customerName: string; customerEmail: string;
  totalAmount: number; status: string; itemCount: number; createdAt: string;
}

interface Stats {
  revenue: { total: number; thisMonth: number; lastMonth: number; growth: number | null }
  orders: { total: number; thisMonth: number; toShip: number; avgOrderValue: number }
  customers: { total: number; thisMonth: number }
  monthly: MonthData[]
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
  pendingAvis: number
  products: { total: number; inStock: number; outOfStock: number; bestsellers: number }
  formations: { total: number; videos: number; ebooks: number }
  testimonials: { total: number; avgRating: string }
  system: { stripeConfigured: boolean; webhookConfigured: boolean; adminPasswordSet: boolean }
}

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function RevenueChart({ data }: { data: MonthData[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map((d, i) => {
        const pct = (d.revenue / max) * 100
        const isLast = i === data.length - 1
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {fmt(d.revenue)} · {d.count} cmd
            </div>
            <div className="w-full rounded-t-md transition-all"
              style={{
                height: `${Math.max(pct, 4)}%`,
                background: isLast ? '#f59e0b' : '#44403c',
              }}
            />
            <span className="text-xs text-stone-500 truncate w-full text-center">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'delivered') return <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">Livrée</span>
  if (status === 'shipped') return <span className="text-xs bg-amber-900/40 text-amber-400 px-2 py-0.5 rounded-full">Expédiée</span>
  return <span className="text-xs bg-stone-700 text-stone-400 px-2 py-0.5 rounded-full">Payée</span>
}

function TypeBadge({ type }: { type: string }) {
  if (type === 'formation') return <span className="text-xs text-purple-400">🎓</span>
  if (type === 'ebook') return <span className="text-xs text-blue-400">📄</span>
  return <span className="text-xs text-stone-400">🥐</span>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(console.error)
  }, [])

  const s = stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-stone-400 text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="CA ce mois"
          value={s ? fmt(s.revenue.thisMonth) : '—'}
          sub={s?.revenue.growth !== null && s?.revenue.growth !== undefined
            ? `${s.revenue.growth >= 0 ? '+' : ''}${s.revenue.growth}% vs mois dernier`
            : s ? `${fmt(s.revenue.lastMonth)} mois dernier` : ''}
          trend={s?.revenue.growth ?? null}
          icon={<Euro className="w-4 h-4" />}
          accent
        />
        <KpiCard
          label="CA total"
          value={s ? fmt(s.revenue.total) : '—'}
          sub={s ? `Moy. ${fmt(s.orders.avgOrderValue)} / commande` : ''}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          label="Commandes ce mois"
          value={s?.orders.thisMonth ?? '—'}
          sub={s ? `${s.orders.total} au total` : ''}
          icon={<ShoppingBag className="w-4 h-4" />}
          alert={s?.orders.toShip ? `${s.orders.toShip} à expédier` : undefined}
        />
        <KpiCard
          label="Clients"
          value={s?.customers.total ?? '—'}
          sub={s ? `+${s.customers.thisMonth} ce mois` : ''}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Graphique + Commandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique revenus */}
        <div className="bg-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold">Revenus — 6 derniers mois</h2>
            {s && <span className="text-xs text-stone-400">{fmt(s.revenue.total)} total</span>}
          </div>
          {s ? <RevenueChart data={s.monthly} /> : (
            <div className="h-32 mt-4 bg-stone-700 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Commandes récentes */}
        <div className="bg-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Commandes récentes</h2>
            <Link href="/admin/commandes" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Toutes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {s?.recentOrders.length === 0 ? (
            <p className="text-stone-500 text-sm">Aucune commande.</p>
          ) : (
            <div className="space-y-2.5">
              {(s?.recentOrders ?? []).map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {o.orderNumber && (
                        <span className="text-xs font-mono text-amber-500">{o.orderNumber}</span>
                      )}
                      <p className="text-sm text-white truncate">{o.customerName}</p>
                    </div>
                    <p className="text-xs text-stone-500">{fmtDate(o.createdAt)} · {o.itemCount} article{o.itemCount > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-amber-400">{fmt(o.totalAmount)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top produits + Catalogue + Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top produits */}
        <div className="bg-stone-800 rounded-xl p-6 lg:col-span-2">
          <h2 className="text-white font-semibold mb-4">Top produits par revenu</h2>
          {s?.topProducts.length === 0 ? (
            <p className="text-stone-500 text-sm">Aucune vente enregistrée.</p>
          ) : (
            <div className="space-y-3">
              {(s?.topProducts ?? []).map((p, i) => {
                const maxRev = s!.topProducts[0]?.revenue ?? 1
                const pct = (p.revenue / maxRev) * 100
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-stone-500 text-sm w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TypeBadge type={p.type} />
                        <p className="text-sm text-white truncate">{p.name}</p>
                      </div>
                      <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-amber-400 font-semibold">{fmt(p.revenue)}</p>
                      <p className="text-xs text-stone-500">{p.count} vente{p.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Alertes + statut */}
        <div className="space-y-4">
          {/* Alertes */}
          <div className="bg-stone-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Alertes</h2>
            <div className="space-y-2">
              {s?.orders.toShip ? (
                <AlertItem icon={<Package className="w-4 h-4" />} color="orange"
                  label={`${s.orders.toShip} commande${s.orders.toShip > 1 ? 's' : ''} à expédier`}
                  href="/admin/commandes" />
              ) : null}
              {s?.pendingAvis ? (
                <AlertItem icon={<Star className="w-4 h-4" />} color="yellow"
                  label={`${s.pendingAvis} avis en attente`}
                  href="/admin/avis" />
              ) : null}
              {s?.products.outOfStock ? (
                <AlertItem icon={<ShoppingBag className="w-4 h-4" />} color="red"
                  label={`${s.products.outOfStock} produit${s.products.outOfStock > 1 ? 's' : ''} hors stock`}
                  href="/admin/produits" />
              ) : null}
              {s && !s.orders.toShip && !s.pendingAvis && !s.products.outOfStock && (
                <p className="text-stone-500 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Tout est en ordre
                </p>
              )}
            </div>
          </div>

          {/* Catalogue */}
          <div className="bg-stone-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Catalogue</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-400">
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> Produits</span>
                <span className="text-white">{s?.products.total ?? '—'}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Formations</span>
                <span className="text-white">{s?.formations.videos ?? '—'}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Ebooks</span>
                <span className="text-white">{s?.formations.ebooks ?? '—'}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Avis publiés</span>
                <span className="text-white">{s?.testimonials.total ?? '—'} <span className="text-stone-500 text-xs">({s?.testimonials.avgRating}/5)</span></span>
              </div>
            </div>
          </div>

          {/* Système */}
          <div className="bg-stone-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Système</h2>
            <div className="space-y-2">
              <SysItem label="Stripe" ok={s?.system.stripeConfigured ?? null} />
              <SysItem label="Webhook" ok={s?.system.webhookConfigured ?? null} />
              <SysItem label="Mot de passe" ok={s?.system.adminPasswordSet ?? null} />
            </div>
            <a href="/" target="_blank" className="mt-4 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
              Voir le site <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, trend, icon, accent, alert }: {
  label: string; value: string | number; sub?: string; trend?: number | null
  icon: React.ReactNode; accent?: boolean; alert?: string
}) {
  return (
    <div className={`rounded-xl p-4 ${accent ? 'bg-amber-600' : 'bg-stone-800'}`}>
      <div className={`flex items-center gap-2 text-sm mb-1 ${accent ? 'text-amber-100' : 'text-amber-400'}`}>
        {icon} {label}
      </div>
      <p className={`text-2xl font-bold ${accent ? 'text-white' : 'text-white'}`}>{value}</p>
      {sub && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${accent ? 'text-amber-100' : 'text-stone-400'}`}>
          {trend !== null && trend !== undefined && (
            trend >= 0
              ? <TrendingUp className="w-3 h-3 text-green-400" />
              : <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          {sub}
        </p>
      )}
      {alert && (
        <p className="text-xs mt-1 flex items-center gap-1 text-orange-300">
          <Clock className="w-3 h-3" /> {alert}
        </p>
      )}
    </div>
  )
}

function AlertItem({ icon, color, label, href }: { icon: React.ReactNode; color: string; label: string; href: string }) {
  const colors: Record<string, string> = {
    orange: 'text-orange-400 bg-orange-900/30',
    yellow: 'text-yellow-400 bg-yellow-900/30',
    red: 'text-red-400 bg-red-900/30',
  }
  return (
    <Link href={href} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-opacity hover:opacity-80 ${colors[color]}`}>
      {icon} {label}
    </Link>
  )
}

function SysItem({ label, ok }: { label: string; ok: boolean | null }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-400">{label}</span>
      {ok === null ? <div className="w-4 h-4 rounded-full bg-stone-600 animate-pulse" />
        : ok ? <CheckCircle2 className="w-4 h-4 text-green-500" />
        : <XCircle className="w-4 h-4 text-red-400" />}
    </div>
  )
}
