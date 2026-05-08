'use client'

import { useState, useMemo } from 'react'
import { Video, Clock, Users, Award } from 'lucide-react'
import type { Formation } from '@/data/formations'
import ProductCard from '@/components/ProductCard'

const stats = [
  { icon: Video, label: 'Formations vidéo HD', value: '4' },
  { icon: Clock, label: 'Heures de contenu', value: '55h+' },
  { icon: Users, label: 'Élèves formés', value: '2 400+' },
  { icon: Award, label: 'Note moyenne', value: '4.9/5' },
]

const levels = [
  { id: 'all', label: 'Tous niveaux' },
  { id: 'débutant', label: 'Débutant' },
  { id: 'intermédiaire', label: 'Intermédiaire' },
  { id: 'avancé', label: 'Avancé' },
]

export default function FormationsClient({ formations }: { formations: Formation[] }) {
  const [activeLevel, setActiveLevel] = useState('all')

  const filtered = useMemo(
    () => (activeLevel === 'all' ? formations : formations.filter((f) => f.level === activeLevel)),
    [activeLevel, formations]
  )

  return (
    <>
      <div className="page-header text-center">
        <h1 className="section-title mb-3">Formations en Ligne</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Apprenez la boulangerie et la viennoiserie artisanale avec nos formations vidéo professionnelles. De chez vous, à votre rythme.
        </p>
      </div>

      <div className="bg-bakery-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <Icon className="w-6 h-6 text-bakery-gold mx-auto mb-2" />
                <p className="font-serif text-3xl font-bold mb-1">{value}</p>
                <p className="text-stone-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-2 mb-10">
          {levels.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeLevel === l.id
                  ? 'bg-bakery-black text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((f) => (
            <ProductCard key={f.id} item={f} />
          ))}
        </div>

        <div className="mt-20 bg-peach-100 rounded-3xl p-10 text-center">
          <h3 className="font-serif text-3xl font-bold mb-4">Satisfait ou Remboursé — 30 jours</h3>
          <p className="text-stone-500 max-w-xl mx-auto mb-2">
            Si vous n'êtes pas satisfait de votre formation dans les 30 jours suivant votre achat, nous vous remboursons intégralement, sans question.
          </p>
          <p className="text-stone-400 text-sm">Accès à vie · Mises à jour incluses · Support par email</p>
        </div>
      </div>
    </>
  )
}
