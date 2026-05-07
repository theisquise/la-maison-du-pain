import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getProducts, getFormations, getTestimonials } from '@/lib/admin-data'

export async function GET() {
  const err = requireAdmin()
  if (err) return err

  const products = getProducts()
  const formations = getFormations()
  const { testimonials } = getTestimonials()

  return NextResponse.json({
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
      total: testimonials.length,
      avgRating:
        testimonials.length > 0
          ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
          : '0',
    },
    system: {
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
      adminPasswordSet: process.env.ADMIN_PASSWORD !== undefined,
    },
  })
}
