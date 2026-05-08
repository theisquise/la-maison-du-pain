'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  GraduationCap,
  Settings,
  MessageSquare,
  LogOut,
  Users,
  Images,
  Package,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/commandes', label: 'Commandes', icon: Package, exact: false },
  { href: '/admin/produits', label: 'Produits', icon: ShoppingBag, exact: false },
  { href: '/admin/formations', label: 'Formations & Ebooks', icon: GraduationCap, exact: false },
  { href: '/admin/clients', label: 'Clients & Fichiers', icon: Users, exact: false },
  { href: '/admin/images', label: 'Médiathèque', icon: Images, exact: false },
  { href: '/admin/avis', label: 'Témoignages', icon: MessageSquare, exact: false },
  { href: '/admin/config', label: 'Configuration', icon: Settings, exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-60 min-h-screen bg-stone-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-stone-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-lg select-none">
            🍞
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">La Maison du Pain</p>
            <p className="text-stone-400 text-xs">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div className="px-3 pb-5 border-t border-stone-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors w-full"
        >
          <LogOut size={17} className="shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
