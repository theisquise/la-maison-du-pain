# 🥐 Guide du Site — La Maison du Pain

## Démarrage rapide

```bash
cd boulangerie
npm install
npm run dev
```
Ouvrez `http://localhost:3000`

---

## 📁 Structure des fichiers à modifier

### ✏️ Tout le texte du site → `data/site-config.ts`
- Nom du site, slogan, description
- Coordonnées, horaires
- Réseaux sociaux
- Textes de toutes les sections

### 🛒 Produits boutique → `data/products.ts`
- Ajouter / supprimer des produits
- Modifier prix, images, descriptions
- Remplir `stripeProductId` après création sur Stripe

### 🎓 Formations & Ebooks → `data/formations.ts`
- Ajouter des formations vidéo
- Ajouter des ebooks PDF
- Configurer les liens de téléchargement (`downloadUrl`)
- Remplir `stripeProductId` après création sur Stripe

### ⭐ Avis clients → `data/testimonials.ts`
- Modifier les témoignages
- Changer les photos clients
- Ajouter de nouveaux avis

---

## 💳 Configurer les paiements Stripe

1. Créez un compte sur **stripe.com**
2. Récupérez vos clés API : Tableau de bord → Développeurs → Clés API
3. Ouvrez le fichier `.env.local` et remplacez :
   ```
   STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_ICI
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_ICI
   ```
4. Pour les webhooks (confirmation de paiement) :
   - Allez dans Stripe → Développeurs → Webhooks
   - Cliquez "Ajouter un endpoint"
   - URL : `https://votresite.com/api/webhook`
   - Événements : `checkout.session.completed`
   - Copiez le "Signing secret" dans `.env.local` sous `STRIPE_WEBHOOK_SECRET`

---

## 🖼️ Changer les images

Les images actuelles viennent d'Unsplash (gratuites). Pour utiliser vos propres photos :
1. Placez vos images dans le dossier `public/images/`
2. Dans les fichiers data, remplacez les URLs par `/images/votre-photo.jpg`

---

## 🚀 Mettre en ligne (déploiement)

### Option 1 : Vercel (recommandé, gratuit)
```bash
npm install -g vercel
vercel
```
Suivez les instructions, puis ajoutez vos variables d'environnement dans le dashboard Vercel.

### Option 2 : Netlify
Connectez votre dépôt Git à Netlify et configurez les variables d'environnement.

---

## 📧 Configurer les emails de confirmation

Dans `app/api/webhook/route.ts`, section `checkout.session.completed`, vous pouvez ajouter l'envoi d'emails avec :
- **Resend** (recommandé) : `npm install resend`
- **Brevo** (ex-Sendinblue)
- **Nodemailer** + Gmail

---

## 🎨 Modifier les couleurs

Ouvrez `tailwind.config.ts` et modifiez les couleurs dans la section `colors` :
- `peach` : couleur de fond pêche
- `bakery.black` : couleur principale sombre
- `bakery.gold` : couleur accent dorée

---

## Pages disponibles

| Page | URL |
|------|-----|
| Accueil | `/` |
| Boutique | `/boutique` |
| Formations | `/formations` |
| Ebooks | `/ebooks` |
| À propos | `/a-propos` |
| Contact | `/contact` |
| Panier | `/panier` |
| Confirmation | `/succes` |
