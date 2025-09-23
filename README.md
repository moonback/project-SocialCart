# 🛒 SocialCart - Plateforme de Shopping Social

**SocialCart** est une plateforme de commerce social moderne qui combine l'expérience de shopping traditionnel avec les interactions sociales et les vidéos courtes, inspirée des tendances actuelles du social commerce.

## 🚀 Pitch

SocialCart révolutionne l'e-commerce en intégrant des vidéos courtes, des interactions sociales et un système de panier intelligent. Les utilisateurs peuvent découvrir des produits via un feed vidéo immersif, suivre leurs créateurs préférés, et effectuer des achats en un clic, le tout dans une interface mobile-first optimisée.

## 🛠️ Stack Technique

### Frontend
- **React 18.3.1** - Framework JavaScript moderne
- **TypeScript 5.5.3** - Typage statique pour une meilleure robustesse
- **Vite 5.4.2** - Build tool rapide et moderne
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **Framer Motion 12.23.19** - Animations fluides et performantes
- **React Router DOM 7.9.1** - Navigation côté client
- **Lucide React 0.344.0** - Icônes modernes et légères

### Backend & Base de données
- **Supabase 2.57.4** - Backend-as-a-Service (Auth, DB, Storage)
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security (RLS)** - Sécurité au niveau des lignes

### PWA & Performance
- **Progressive Web App (PWA)** - Installation native sur mobile
- **Service Worker** - Mise en cache intelligente
- **Lazy Loading** - Chargement à la demande des composants
- **Image Optimization** - Images optimisées et adaptatives

## ✨ Fonctionnalités Principales (MVP)

### 🎥 Feed Vidéo Social
- **Découverte de produits** via vidéos courtes verticales
- **Navigation intuitive** par swipe (gestes tactiles)
- **Contrôles vidéo** (play/pause, volume, plein écran)
- **Autoplay intelligent** avec gestion de la bande passante

### 👥 Interactions Sociales
- **Système de likes** et de commentaires
- **Suivi d'utilisateurs** et de créateurs
- **Partage de contenu** (réseaux sociaux, liens)
- **Profils utilisateurs** complets avec avatars

### 🛍️ Système d'E-commerce
- **Catalogue de produits** avec variantes et options
- **Panier intelligent** avec gestion des quantités
- **Paiement intégré** (Stripe en préparation)
- **Gestion des commandes** et historique

### 📱 Interface Mobile-First
- **Design responsive** adapté à tous les écrans
- **Navigation tactile** optimisée
- **Animations fluides** avec Framer Motion
- **Thème sombre/clair** (en développement)

## 📋 Prérequis

### Développement
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** pour le versioning

### Supabase
- **Compte Supabase** (gratuit)
- **Projet Supabase** configuré
- **Supabase CLI** (optionnel, pour la gestion locale)

## 🚀 Installation et Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/socialcart.git
cd socialcart
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration Supabase

#### Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé anonyme

#### Configurer les variables d'environnement
Créer un fichier `.env.local` à la racine :
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optionnel - pour le développement
VITE_APP_ENV=development
```

#### Initialiser la base de données
```bash
# Exécuter le script de création des tables
psql -h your-db-host -U postgres -d postgres -f supabase/database_schema.sql

# Ou via l'interface Supabase SQL Editor
# Copier-coller le contenu de supabase/database_schema.sql
```

### 4. Configuration du Storage
```sql
-- Dans l'éditeur SQL de Supabase
-- Créer les buckets pour les images et vidéos
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('product-videos', 'product-videos', true),
('user-avatars', 'user-avatars', true);
```

## 🏃‍♂️ Lancement du Projet

### Développement
```bash
npm run dev
# ou
yarn dev
```
L'application sera accessible sur `http://localhost:5173`

### Production
```bash
# Build
npm run build
# ou
yarn build

# Preview
npm run preview
# ou
yarn preview
```

### Linting
```bash
npm run lint
# ou
yarn lint
```

## 📁 Structure du Projet

```
socialcart/
├── 📁 public/                 # Assets statiques
│   ├── 📁 icons/             # Icônes PWA
│   ├── manifest.json         # Configuration PWA
│   └── sw.js                 # Service Worker
├── 📁 src/                   # Code source
│   ├── 📁 components/        # Composants réutilisables
│   │   ├── BottomNav.tsx     # Navigation bottom
│   │   ├── TopBar.tsx        # Barre de navigation top
│   │   ├── VideoFeed.tsx     # Feed vidéo principal
│   │   ├── ProductCard.tsx   # Carte produit
│   │   └── ...
│   ├── 📁 hooks/             # Hooks personnalisés
│   │   ├── useAuth.tsx       # Gestion authentification
│   │   ├── useCart.tsx       # Gestion panier
│   │   └── useSocial.tsx     # Interactions sociales
│   ├── 📁 lib/               # Services et utilitaires
│   │   ├── supabase.ts       # Client Supabase
│   │   ├── products.ts       # Service produits
│   │   └── ...
│   ├── 📁 pages/             # Pages de l'application
│   │   ├── Home.tsx          # Page d'accueil
│   │   ├── Cart.tsx          # Page panier
│   │   ├── Profile.tsx       # Profil utilisateur
│   │   └── ...
│   ├── App.tsx               # Composant racine
│   ├── main.tsx              # Point d'entrée
│   └── index.css             # Styles globaux
├── 📁 supabase/              # Scripts base de données
│   ├── database_schema.sql   # Schéma complet
│   ├── auth_schema.sql       # Configuration auth
│   └── ...
├── package.json              # Dépendances et scripts
├── tailwind.config.js        # Configuration Tailwind
├── vite.config.ts            # Configuration Vite
└── tsconfig.json             # Configuration TypeScript
```

## 🔧 Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ |
| `VITE_APP_ENV` | Environnement (development/production) | ❌ |

## 🎨 Design System

### Couleurs
- **Primary** : Palette bleue professionnelle (#0ea5e9)
- **Surface** : Tons neutres pour les fonds
- **Glass** : Effets de verre avec backdrop-blur

### Typographie
- **Font Family** : Inter (Google Fonts)
- **Weights** : 300, 400, 500, 600, 700, 800, 900

### Animations
- **Framer Motion** pour les transitions fluides
- **Animations personnalisées** : float, pulse-glow
- **Gestes tactiles** optimisés pour mobile

## 🤝 Bonnes Pratiques pour Contribuer

### 1. Workflow Git
```bash
# Créer une branche feature
git checkout -b feature/nom-de-la-feature

# Commits descriptifs
git commit -m "feat: ajouter système de notifications"

# Push et Pull Request
git push origin feature/nom-de-la-feature
```

### 2. Standards de Code
- **TypeScript strict** : Utiliser les types partout
- **ESLint** : Respecter les règles de linting
- **Composants fonctionnels** : Privilégier les hooks
- **Nommage** : camelCase pour variables, PascalCase pour composants

### 3. Structure des Composants
```tsx
// Imports externes
import React from 'react';
import { motion } from 'framer-motion';

// Imports internes
import { UserAvatar } from './UserAvatar';

// Types
interface ComponentProps {
  // Props avec types explicites
}

// Composant
export function Component({ prop }: ComponentProps) {
  // Hooks
  // Handlers
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 4. Tests (Recommandé)
- **Tests unitaires** avec Vitest
- **Tests d'intégration** avec React Testing Library
- **Tests E2E** avec Playwright (optionnel)

## 📱 PWA et Performance

### Service Worker
- **Cache stratégique** pour les assets statiques
- **Mise à jour intelligente** des ressources
- **Mode offline** basique

### Optimisations
- **Lazy loading** des routes et composants
- **Image optimization** avec formats modernes
- **Code splitting** automatique avec Vite
- **Tree shaking** pour réduire la taille du bundle

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation
npm i -g vercel

# Déploiement
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Upload du dossier dist/
```

### Variables d'environnement en production
Configurer les variables dans votre plateforme de déploiement :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Monitoring et Analytics

### Métriques recommandées
- **Core Web Vitals** (LCP, FID, CLS)
- **Taux de conversion** e-commerce
- **Engagement** sur le feed vidéo
- **Performance** des paiements

## 🔒 Sécurité

### Authentification
- **Supabase Auth** avec PKCE flow
- **JWT tokens** sécurisés
- **Refresh tokens** automatiques

### Base de données
- **Row Level Security (RLS)** activé
- **Policies** granulaires par table
- **Validation** côté client et serveur

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Supabase** pour l'infrastructure backend
- **Vercel** pour l'hébergement
- **Tailwind CSS** pour le design system
- **Framer Motion** pour les animations

---

**SocialCart** - Révolutionner le commerce social, une vidéo à la fois 🚀