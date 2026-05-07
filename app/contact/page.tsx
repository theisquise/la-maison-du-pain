"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Intégrez ici votre service d'emailing (Resend, EmailJS, Formspree...)
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  const hours = siteConfig.hours;

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
            {sent ? (
              <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 mb-1">Message envoyé !</p>
                  <p className="text-green-700 text-sm">Merci {form.name}, nous vous répondrons dans les plus brefs délais.</p>
                </div>
              </div>
            ) : (
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
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
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
                  <p className="text-stone-500 text-sm">{siteConfig.contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-bakery-brown" />
                </div>
                <div>
                  <p className="font-semibold text-bakery-black mb-1">Téléphone</p>
                  <a href={`tel:${siteConfig.contact.phone}`} className="text-stone-500 text-sm hover:text-bakery-black transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-bakery-brown" />
                </div>
                <div>
                  <p className="font-semibold text-bakery-black mb-1">Email</p>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-stone-500 text-sm hover:text-bakery-black transition-colors">
                    {siteConfig.contact.email}
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
                    <span>{heure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
