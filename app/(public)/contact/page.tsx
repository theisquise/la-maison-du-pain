import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getConfig } from '@/lib/admin-data'
import ContactForm from './ContactForm'

export const revalidate = 60

export const metadata = {
  title: 'Contact',
  description: 'Une question ? Contactez-nous, nous vous répondons sous 24h.',
}

export default function ContactPage() {
  const { siteConfig } = getConfig()
  const { contact, hours } = siteConfig

  return (
    <>
      <div className="page-header text-center">
        <h1 className="section-title mb-3">Contactez-nous</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Une question sur nos produits, formations ou commandes ? Nous vous répondons sous 24h.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Formulaire */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-bakery-black mb-6">Envoyer un message</h2>
            <ContactForm />
          </div>

          {/* Infos de contact */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-bakery-black mb-6">Nos coordonnées</h2>
            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-bakery-brown" />
                </div>
                <div>
                  <p className="font-semibold text-bakery-black mb-1">Adresse</p>
                  <p className="text-stone-500 text-sm">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-bakery-brown" />
                </div>
                <div>
                  <p className="font-semibold text-bakery-black mb-1">Téléphone</p>
                  <a href={`tel:${contact.phone}`} className="text-stone-500 text-sm hover:text-bakery-black transition-colors">
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-bakery-brown" />
                </div>
                <div>
                  <p className="font-semibold text-bakery-black mb-1">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-stone-500 text-sm hover:text-bakery-black transition-colors">
                    {contact.email}
                  </a>
                  <p className="text-stone-400 text-xs mt-0.5">Réponse sous 24h</p>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-bakery-black rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-bakery-gold" />
                <h3 className="font-serif font-bold text-lg">Horaires d'ouverture</h3>
              </div>
              <ul className="space-y-2">
                {Object.entries(hours).map(([jour, heure]) => (
                  <li key={jour} className="flex justify-between text-sm text-stone-300">
                    <span className="capitalize">{jour}</span>
                    <span>{heure as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
