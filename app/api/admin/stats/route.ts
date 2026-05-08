import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getProducts, getFormations, getTestimonials } from '@/lib/admin-data'
import { getAllOrders, getAllCustomers } from '@/lib/customer-data'

function monthLabel(date: Date) {
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

export async function GET() {
  const err = requireAdmin()
  if (err) return err

  const products = getProducts()
  const formations = getFormations()
  const { testimonials } = getTestimonials()
  const orders = getAllOrders()
  const customers = getAllCustomers()

  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonthOrders = orders.filter((o) => new Date(o.createdAt) >= startOfThisMonth)
  const lastMonthOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfLastMonth && new Date(o.createdAt) < startOfThisMonth
  )

  const revenueThisMonth = thisMonthOrders.reduce((s, o) => s + o.totalAmount, 0)
  const revenueLastMonth = lastMonthOrders.reduce((s, o) => s + o.totalAmount, 0)
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0)
  const growth = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : null

  const toShip = orders.filter(
    (o) => o.items.some((i) => i.type === 'product') && o.status === 'paid'
  ).length

  const thisMonthCustomers = customers.filter(
    (c) => new Date(c.createdAt) >= startOfThisMonth
  ).length

  // Revenus des 6 derniers mois
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const next = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1)
    const monthOrders = orders.filter(
      (o) => new Date(o.createdAt) >= d && new Date(o.createdAt) < next
    )
    return {
      label: monthLabel(d),
      revenue: parseFloat(monthOrders.reduce((s, o) => s + o.totalAmount, 0).toFixed(2)),
      count: monthOrders.length,
    }
  })

  // Top 5 produits par revenu
  const itemMap = new Map<string, { id: string; name: string; type: string; revenue: number; count: number }>()
  for (const order of orders) {
    for (const item of order.items) {
      const existing = itemMap.get(item.id)
      if (existing) {
        existing.revenue += item.price
        existing.count += 1
      } else {
        itemMap.set(item.id, { id: item.id, name: item.name, type: item.type, revenue: item.price, count: 1 })
      }
    }
  }
  const topProducts = Array.from(itemMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({ ...p, revenue: parseFloat(p.revenue.toFixed(2)) }))

  // 5 dernières commandes avec nom client
  const recentOrders = orders.slice(0, 5).map((o) => {
    const customer = customers.find((c) => c.id === o.customerId)
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: customer?.name ?? '—',
      customerEmail: customer?.email ?? '',
      totalAmount: o.totalAmount,
      status: o.status,
      itemCount: o.items.length,
      createdAt: o.createdAt,
    }
  })

  const pendingAvis = testimonials.filter((t) => t.pending).length

  return NextResponse.json({
    revenue: {
      total: parseFloat(totalRevenue.toFixed(2)),
      thisMonth: parseFloat(revenueThisMonth.toFixed(2)),
      lastMonth: parseFloat(revenueLastMonth.toFixed(2)),
      growth,
    },
    orders: {
      total: orders.length,
      thisMonth: thisMonthOrders.length,
      toShip,
      avgOrderValue: orders.length > 0 ? parseFloat((totalRevenue / orders.length).toFixed(2)) : 0,
    },
    customers: {
      total: customers.length,
      thisMonth: thisMonthCustomers,
    },
    monthly,
    topProducts,
    recentOrders,
    pendingAvis,
    products: {
      total: products.length,
      inStock: products.filter((p) => p.inStock).length,
      outOfStock: products.filter((p) => !p.inStock).length,
      bestsellers: products.filter((p) => p.bestseller).length,
    },
    formations: {
      total: formations.length,
      videos: formations.filter((f) => f.type === 'formation').length,
      ebooks: formations.filter((f) => f.type === 'ebook').length,
    },
    testimonials: {
      total: testimonials.filter((t) => !t.pending).length,
      avgRating:
        testimonials.length > 0
          ? (testimonials.filter((t) => !t.pending).reduce((s, t) => s + t.rating, 0) / (testimonials.filter((t) => !t.pending).length || 1)).toFixed(1)
          : '0',
    },
    system: {
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
      adminPasswordSet: process.env.ADMIN_PASSWORD !== undefined,
    },
  })
}
