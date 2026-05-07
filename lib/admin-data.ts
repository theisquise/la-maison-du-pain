import fs from 'fs'
import path from 'path'
import { products as seedProducts, type Product } from '@/data/products'
import { formations as seedFormations, type Formation } from '@/data/formations'
import { siteConfig as seedSiteConfig, navigation as seedNavigation } from '@/data/site-config'
import {
  testimonials as seedTestimonials,
  testimonialsConfig as seedTestimonialsConfig,
  type Testimonial,
} from '@/data/testimonials'

export type { Product, Formation, Testimonial }

const DB_DIR = path.join(process.cwd(), 'data', 'db')

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
}

function readJson<T>(filename: string, defaultValue: T): T {
  const filepath = path.join(DB_DIR, filename)
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T
    }
  } catch (e) {
    console.error(`[admin-data] Error reading ${filename}:`, e)
  }
  return defaultValue
}

function writeJson<T>(filename: string, data: T): void {
  ensureDir()
  const filepath = path.join(DB_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
}

// --- Products ---
export function getProducts(): Product[] {
  return readJson<Product[]>('products.json', seedProducts)
}
export function saveProducts(data: Product[]): void {
  writeJson('products.json', data)
}

// --- Formations ---
export function getFormations(): Formation[] {
  return readJson<Formation[]>('formations.json', seedFormations)
}
export function saveFormations(data: Formation[]): void {
  writeJson('formations.json', data)
}

// --- Config ---
export type SiteConfigData = {
  siteConfig: typeof seedSiteConfig
  navigation: typeof seedNavigation
}
export function getConfig(): SiteConfigData {
  return readJson<SiteConfigData>('config.json', {
    siteConfig: seedSiteConfig,
    navigation: seedNavigation,
  })
}
export function saveConfig(data: SiteConfigData): void {
  writeJson('config.json', data)
}

// --- Testimonials ---
export type TestimonialsData = {
  testimonials: Testimonial[]
  config: typeof seedTestimonialsConfig
}
export function getTestimonials(): TestimonialsData {
  return readJson<TestimonialsData>('testimonials.json', {
    testimonials: seedTestimonials,
    config: seedTestimonialsConfig,
  })
}
export function saveTestimonials(data: TestimonialsData): void {
  writeJson('testimonials.json', data)
}
