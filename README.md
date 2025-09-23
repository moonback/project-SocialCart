# 🛍️ Shopping Connect - Plateforme de Shopping en Direct

**Shopping Connect** est une plateforme innovante de e-commerce social qui combine shopping vidéo, live streaming et gestion de produits dans une expérience mobile-first moderne. L'application permet aux vendeurs de créer des produits avec vidéos et aux acheteurs de découvrir et acheter via un feed vidéo interactif style TikTok.

## 🚀 Stack Technique

### Frontend
- **React 18** - Framework UI moderne avec hooks
- **TypeScript** - Typage statique pour la robustesse
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire avec design system personnalisé
- **Framer Motion** - Animations fluides et micro-interactions
- **React Router DOM** - Navigation SPA
- **Lucide React** - Icônes modernes et cohérentes

### Backend & Base de Données
- **Supabase** - Backend-as-a-Service complet
  - PostgreSQL avec Row Level Security (RLS)
  - Authentification intégrée
  - Storage pour images/vidéos
  - Real-time subscriptions
- **Supabase Auth** - Gestion utilisateurs avec PKCE flow

### Outils de Développement
- **ESLint** - Linting et qualité de code
- **PostCSS** - Traitement CSS
- **Autoprefixer** - Compatibilité navigateurs

## ✨ Fonctionnalités Principales (MVP)

### 🎥 Feed Vidéo Interactif
- **Découverte de produits** via feed vertical style TikTok
- **Contrôles vidéo avancés** (play/pause, vitesse, son)
- **Actions sociales** (like, partage, sauvegarde, suivi)
- **Navigation fluide** entre produits
- **Auto-play intelligent** avec paramètres utilisateur

### 🛒 Gestion des Produits
- **Création de produits** avec images et vidéos
- **Gestion des variantes** (couleur, taille, matériau)
- **Catégorisation** et marques prédéfinies
- **Inventaire** et suivi des stocks
- **Dashboard vendeur** pour gestion des produits

### 👤 Profil Utilisateur
- **Authentification** complète (inscription/connexion)
- **Upload d'avatar** avec preview
- **Profil vendeur** avec statistiques
- **Gestion des paramètres** personnalisés

### 🔍 Recherche & Navigation
- **Recherche de produits** avec filtres
- **Navigation intuitive** avec bottom nav
- **Détails produit** enrichis avec onglets
- **Panier** et processus d'achat

### 📱 Design Mobile-First
- **Interface responsive** optimisée mobile
- **Animations fluides** avec Framer Motion
- **Design system** cohérent avec Tailwind
- **UX moderne** avec glassmorphism et gradients

## 📋 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Compte Supabase** (gratuit)
- **Git** pour le versioning

## 🛠️ Installation & Configuration

### 1. Cloner le Projet
```bash
git clone <repository-url>
cd project
```

### 2. Installer les Dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration Supabase

#### Créer un Projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé anonyme

#### Configurer les Variables d'Environnement
Créer un fichier `.env.local` :
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Initialiser la Base de Données
```bash
# Exécuter le script SQL dans Supabase SQL Editor
cat supabase/database_schema.sql
```

### 4. Configuration Storage
Dans Supabase Dashboard :
1. Aller dans **Storage**
2. Créer les buckets :
   - `products` (public)
   - `profiles` (public)

### 5. Configuration RLS Policies
Les politiques de sécurité sont définies dans `database_schema.sql` :
- Accès public aux produits actifs
- Gestion privée des paniers et commandes
- Upload d'images pour utilisateurs authentifiés

## 🚀 Lancement du Projet

### Développement
```bash
npm run dev
# ou
yarn dev
```
L'application sera disponible sur `http://localhost:5173`

### Build Production
```bash
npm run build
# ou
yarn build
```

### Preview Production
```bash
npm run preview
# ou
yarn preview
```

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── BottomNav.tsx    # Navigation mobile
│   ├── Layout.tsx       # Layout principal
│   ├── TopBar.tsx       # Barre de navigation
│   ├── VideoFeed.tsx    # Feed vidéo principal
│   ├── ProductCard.tsx  # Carte produit
│   ├── UserAvatar.tsx   # Avatar utilisateur
│   └── ...
├── hooks/               # Hooks personnalisés
│   ├── useAuth.tsx      # Authentification
│   └── useCart.tsx      # Gestion panier
├── lib/                 # Services et utilitaires
│   ├── supabase.ts      # Client Supabase
│   ├── products.ts      # Service produits
│   └── categories.ts    # Gestion catégories
├── pages/               # Pages de l'application
│   ├── Home.tsx         # Page d'accueil
│   ├── Auth.tsx         # Authentification
│   ├── Profile.tsx      # Profil utilisateur
│   ├── CreateProduct.tsx # Création produit
│   ├── ProductDetail.tsx # Détails produit
│   └── ...
├── App.tsx              # Composant racine
├── main.tsx             # Point d'entrée
└── index.css            # Styles globaux
```

## 🔧 Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ |

## 🎨 Design System

### Couleurs
- **Primary** : Violet (#a855f7) - Actions principales
- **Secondary** : Bleu (#3b82f6) - Actions secondaires  
- **Surface** : Gris neutre - Arrière-plans et textes

### Typographie
- **Font** : Inter (system-ui fallback)
- **Weights** : 400, 500, 600, 700

### Animations
- **Framer Motion** pour les transitions
- **Animations CSS** personnalisées (fade, scale, slide)
- **Micro-interactions** sur les boutons et cartes

## 🤝 Bonnes Pratiques pour Contribuer

### Code Style
- **TypeScript strict** - Typage obligatoire
- **ESLint** - Respect des règles de linting
- **Composants fonctionnels** avec hooks
- **Props interfaces** définies

### Structure des Composants
```typescript
// Interface des props
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// Composant avec TypeScript
export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks en premier
  const [state, setState] = useState();
  
  // Logique métier
  
  // Rendu
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

### Conventions
- **Noms de fichiers** : PascalCase pour composants
- **Noms de variables** : camelCase
- **Classes CSS** : Tailwind utilities uniquement
- **Imports** : Ordre alphabétique

### Git Workflow
1. **Feature branch** depuis `main`
2. **Commits atomiques** avec messages clairs
3. **Pull Request** avec description détaillée
4. **Review** obligatoire avant merge

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la [documentation](#-documentation)
2. Consulter les [issues GitHub](../../issues)
3. Créer une nouvelle issue si nécessaire

---

**Shopping Connect** - Révolutionner l'e-commerce avec le shopping vidéo social 🚀
