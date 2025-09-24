# 🛒 SocialCart - Plateforme de Shopping Social

**SocialCart** est une plateforme de commerce social moderne qui révolutionne l'e-commerce en combinant l'expérience immersive des réseaux sociaux avec la simplicité d'achat traditionnel. Découvrez des produits via un feed vidéo vertical, suivez vos créateurs préférés, et effectuez des achats en un clic dans une interface mobile-first optimisée.

## 🚀 Pitch

SocialCart transforme le shopping en expérience sociale immersive. Les utilisateurs naviguent dans un feed vidéo vertical inspiré de TikTok, découvrent des produits via des vidéos courtes, interagissent avec la communauté (likes, commentaires, partages), et achètent directement depuis l'application. La plateforme connecte créateurs et consommateurs dans un écosystème de commerce social innovant.

## 🛠️ Stack Technique

### Frontend
- **React 18.3.1** - Framework JavaScript moderne avec hooks et context
- **TypeScript 5.5.3** - Typage statique pour une meilleure robustesse
- **Vite 5.4.2** - Build tool ultra-rapide avec HMR optimisé
- **Tailwind CSS 3.4.1** - Framework CSS utility-first avec design system personnalisé
- **Framer Motion 12.23.19** - Animations fluides et gestes tactiles
- **React Router DOM 7.9.1** - Navigation côté client avec lazy loading
- **Lucide React 0.344.0** - Icônes modernes et légères

### Backend & Base de données
- **Supabase 2.57.4** - Backend-as-a-Service complet (Auth, DB, Storage, Realtime)
- **PostgreSQL** - Base de données relationnelle avec Row Level Security
- **Row Level Security (RLS)** - Sécurité granulaire au niveau des lignes
- **Supabase Storage** - Stockage de fichiers avec CDN intégré

### PWA & Performance
- **Progressive Web App (PWA)** - Installation native sur mobile et desktop
- **Service Worker** - Mise en cache intelligente et mode hors ligne
- **Lazy Loading** - Chargement à la demande des composants et routes
- **Image Optimization** - Images adaptatives et optimisées
- **Code Splitting** - Bundle optimisé avec Vite

### Intelligence Artificielle
- **Google Gemini AI** - Analyse automatique d'images de produits
- **Reconnaissance d'images** - Extraction automatique des informations produit

## ✨ Fonctionnalités Principales (MVP)

### 🎥 Feed Vidéo Social
- **Navigation intuitive** par swipe vertical (gestes tactiles)
- **Autoplay intelligent** avec gestion de la bande passante
- **Contrôles vidéo** avancés (play/pause, volume, plein écran)
- **Préchargement** de la vidéo suivante pour une expérience fluide
- **Gestion mémoire** optimisée pour les performances

### 👥 Interactions Sociales
- **Système de likes** et de commentaires avec réponses
- **Suivi d'utilisateurs** et de créateurs préférés
- **Partage de contenu** sur réseaux sociaux et liens directs
- **Profils utilisateurs** complets avec avatars et bio
- **Système de fidélité** avec points et récompenses

### 🛍️ Système d'E-commerce Complet
- **Catalogue de produits** avec variantes et options multiples
- **Panier intelligent** avec gestion des quantités et variantes
- **Système de commandes** avec suivi en temps réel
- **Gestion d'inventaire** et de stock en temps réel
- **Interface de paiement** (Stripe en préparation)

### 📱 Interface Mobile-First
- **Design responsive** adapté à tous les écrans
- **Navigation tactile** optimisée pour mobile
- **Animations fluides** avec Framer Motion
- **Thème glassmorphism** moderne et élégant
- **PWA** avec installation native

### 🤖 Intelligence Artificielle
- **Analyse automatique d'images** avec Google Gemini
- **Extraction d'informations** produit (nom, description, catégorie, prix)
- **Génération de tags** automatiques
- **Recommandations** personnalisées (en développement)

## 📋 Prérequis

### Développement
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** pour le versioning

### Supabase
- **Compte Supabase** (gratuit jusqu'à 500MB)
- **Projet Supabase** configuré
- **Supabase CLI** (optionnel, pour la gestion locale)

### API Externes
- **Google Gemini API** (pour l'analyse d'images)

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

# Google Gemini AI (optionnel)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Environnement
VITE_APP_ENV=development
```

#### Initialiser la base de données
```bash
# Via l'interface Supabase SQL Editor
# Copier-coller le contenu de supabase/database_schema.sql
```

### 4. Configuration du Storage
```sql
-- Dans l'éditeur SQL de Supabase
-- Créer les buckets pour les images et vidéos
INSERT INTO storage.buckets (id, name, public) VALUES 
('products', 'products', true),
('user-avatars', 'user-avatars', true);
```

### 5. Configuration des politiques RLS
```sql
-- Exécuter les scripts de sécurité
-- supabase/auth_schema.sql
-- supabase/complete_auth_setup.sql
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

### Linting et Tests
```bash
# Linting
npm run lint
# ou
yarn lint

# Tests (à venir)
npm run test
# ou
yarn test
```

## 📁 Structure du Projet

```
socialcart/
├── 📁 public/                 # Assets statiques et PWA
│   ├── 📁 icons/             # Icônes PWA (72x72 à 512x512)
│   ├── manifest.json         # Configuration PWA
│   ├── sw.js                 # Service Worker développement
│   ├── sw-production.js      # Service Worker production
│   └── debug-sw.html         # Page de débogage PWA
├── 📁 src/                   # Code source principal
│   ├── 📁 components/        # Composants réutilisables
│   │   ├── 📁 VideoFeed/     # Composants du feed vidéo
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   └── ...
│   │   ├── BottomNav.tsx     # Navigation bottom
│   │   ├── TopBar.tsx        # Barre de navigation top
│   │   ├── ProductCard.tsx   # Carte produit
│   │   └── ...
│   ├── 📁 hooks/             # Hooks personnalisés
│   │   ├── useAuth.tsx       # Gestion authentification
│   │   ├── useCart.tsx       # Gestion panier
│   │   ├── useSocial.tsx     # Interactions sociales
│   │   ├── useVideoPlayer.tsx # Gestion vidéo
│   │   └── ...
│   ├── 📁 lib/               # Services et utilitaires
│   │   ├── supabase.ts       # Client Supabase
│   │   ├── products.ts       # Service produits
│   │   ├── social.ts         # Service social
│   │   ├── gemini.ts         # Service IA
│   │   └── ...
│   ├── 📁 pages/             # Pages de l'application
│   │   ├── Home.tsx          # Page d'accueil (feed vidéo)
│   │   ├── Cart.tsx          # Page panier
│   │   ├── Profile.tsx       # Profil utilisateur
│   │   ├── CreateProduct.tsx # Création de produit
│   │   └── ...
│   ├── 📁 services/          # Services métier
│   │   └── productService.tsx
│   ├── App.tsx               # Composant racine
│   ├── main.tsx              # Point d'entrée
│   └── index.css             # Styles globaux
├── 📁 supabase/              # Scripts base de données
│   ├── database_schema.sql   # Schéma complet
│   ├── auth_schema.sql       # Configuration auth
│   ├── CREATE_LOYALTY_SYSTEM.sql
│   └── ...
├── 📁 scripts/               # Scripts de build
│   └── build-sw.js          # Build Service Worker
├── 📁 docs/                  # Documentation
│   └── APP_ANALYSIS_AND_IMPROVEMENTS.md
├── package.json              # Dépendances et scripts
├── tailwind.config.js        # Configuration Tailwind
├── vite.config.ts            # Configuration Vite
├── tsconfig.json             # Configuration TypeScript
└── vercel.json               # Configuration déploiement
```

## 🔧 Variables d'Environnement

| Variable | Description | Obligatoire | Exemple |
|----------|-------------|-------------|---------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | ✅ | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_GEMINI_API_KEY` | Clé API Google Gemini | ❌ | `AIzaSyB...` |
| `VITE_APP_ENV` | Environnement (development/production) | ❌ | `development` |

## 🎨 Design System

### Couleurs
- **Primary** : Palette bleue professionnelle (#0ea5e9)
- **Secondary** : Tons neutres pour les fonds (#64748b)
- **Surface** : Couleurs de surface avec transparence
- **Glass** : Effets de verre avec backdrop-blur

### Typographie
- **Font Family** : Inter (Google Fonts)
- **Weights** : 300, 400, 500, 600, 700, 800, 900
- **Responsive** : Tailles adaptatives selon l'écran

### Animations
- **Framer Motion** pour les transitions fluides
- **Animations personnalisées** : float, pulse-glow, fade-in
- **Gestes tactiles** optimisés pour mobile
- **Micro-interactions** pour améliorer l'UX

## 🤝 Bonnes Pratiques pour Contribuer

### 1. Workflow Git
```bash
# Créer une branche feature
git checkout -b feature/nom-de-la-feature

# Commits descriptifs avec convention
git commit -m "feat: ajouter système de notifications"
git commit -m "fix: corriger bug de chargement vidéo"
git commit -m "docs: mettre à jour README"

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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Imports internes
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';

// Types
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
}

// Composant
export function Component({ title, isVisible = true, onAction }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers avec useCallback
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      <h2>{title}</h2>
    </motion.div>
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
- **Mode offline** basique avec fallbacks
- **Gestion d'erreur** robuste

### Optimisations
- **Lazy loading** des routes et composants
- **Image optimization** avec formats modernes
- **Code splitting** automatique avec Vite
- **Tree shaking** pour réduire la taille du bundle
- **Preloading** des ressources critiques

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
- `VITE_GEMINI_API_KEY` (optionnel)

## 📊 Monitoring et Analytics

### Métriques recommandées
- **Core Web Vitals** (LCP, FID, CLS)
- **Taux de conversion** e-commerce
- **Engagement** sur le feed vidéo
- **Performance** des paiements
- **Temps de chargement** des vidéos

### Outils de monitoring
- **Vercel Analytics** pour les performances
- **Supabase Dashboard** pour la base de données
- **Google Analytics** pour l'usage (optionnel)

## 🔒 Sécurité

### Authentification
- **Supabase Auth** avec PKCE flow
- **JWT tokens** sécurisés
- **Refresh tokens** automatiques
- **Validation** côté client et serveur

### Base de données
- **Row Level Security (RLS)** activé
- **Policies** granulaires par table
- **Validation** des schémas
- **Sanitisation** des entrées utilisateur

### Stockage
- **Politiques de sécurité** sur les buckets
- **Validation** des types de fichiers
- **Limitation** de la taille des uploads

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Supabase** pour l'infrastructure backend complète
- **Vercel** pour l'hébergement et les performances
- **Tailwind CSS** pour le design system
- **Framer Motion** pour les animations fluides
- **Google Gemini** pour l'intelligence artificielle

## 🆘 Support

### Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée
- [API_DOCS.md](API_DOCS.md) - Documentation des API
- [DB_SCHEMA.md](DB_SCHEMA.md) - Schéma de base de données
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution

### Contact
- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/socialcart/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-username/socialcart/discussions)
- **Email** : support@socialcart.app

---

**SocialCart** - Révolutionner le commerce social, une vidéo à la fois 🚀

*Construit avec ❤️ pour créer l'avenir du shopping social*