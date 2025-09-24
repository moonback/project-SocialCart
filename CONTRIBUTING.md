# 🤝 Guide de Contribution - SocialCart

## Bienvenue ! 👋

Merci de votre intérêt pour contribuer à **SocialCart** ! Ce guide vous aidera à comprendre comment participer au développement de la plateforme de commerce social de nouvelle génération.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Setup de développement](#setup-de-développement)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapport de bugs](#rapport-de-bugs)
- [Propositions de fonctionnalités](#propositions-de-fonctionnalités)
- [Tests et qualité](#tests-et-qualité)
- [Documentation](#documentation)

## 📜 Code de conduite

### Notre engagement

Nous nous engageons à offrir une expérience de contribution ouverte et accueillante pour tous, indépendamment de l'âge, de la taille, du handicap, de l'ethnicité, de l'identité et de l'expression de genre, du niveau d'expérience, de l'éducation, du statut socio-économique, de la nationalité, de l'apparence personnelle, de la race, de la religion ou de l'orientation sexuelle.

### Comportements attendus

- **Respect mutuel** et communication constructive
- **Empathie** envers les autres points de vue
- **Acceptation** des critiques constructives
- **Focus** sur ce qui est le mieux pour la communauté
- **Respect** des autres contributeurs et utilisateurs
- **Transparence** dans les décisions techniques

### Comportements inacceptables

- **Langage** ou images sexualisés ou violents
- **Trolling**, commentaires insultants ou désobligeants
- **Harcèlement** public ou privé
- **Publishing** d'informations privées sans permission
- **Comportement** non professionnel ou discriminatoire
- **Spam** ou promotion non sollicitée

## 🚀 Comment contribuer

### Types de contributions

#### 🐛 Correction de bugs
- Identifier et corriger des problèmes existants
- Améliorer la gestion d'erreurs
- Optimiser les performances
- Corriger les problèmes d'accessibilité

#### ✨ Nouvelles fonctionnalités
- Implémenter des features demandées
- Améliorer l'expérience utilisateur
- Ajouter de nouveaux composants
- Intégrer des APIs externes

#### 📚 Documentation
- Améliorer la documentation existante
- Ajouter des exemples de code
- Traduire la documentation
- Créer des tutoriels et guides

#### 🧪 Tests
- Ajouter des tests unitaires
- Implémenter des tests d'intégration
- Améliorer la couverture de tests
- Tests de performance et E2E

#### 🎨 Design
- Améliorer l'interface utilisateur
- Optimiser l'expérience mobile
- Créer de nouveaux assets
- Améliorer l'accessibilité

#### 🔧 Infrastructure
- Optimiser les performances
- Améliorer la sécurité
- Automatiser les déploiements
- Monitoring et alertes

### Processus de contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 🛠️ Setup de développement

### Prérequis

```bash
# Node.js (version 18+)
node --version  # v18.0.0+

# npm ou yarn
npm --version   # 8.0.0+
# ou
yarn --version  # 1.22.0+

# Git
git --version   # 2.30.0+

# Supabase CLI (optionnel)
supabase --version  # 1.0.0+
```

### Installation

```bash
# 1. Fork et cloner le repository
git clone https://github.com/VOTRE-USERNAME/socialcart.git
cd socialcart

# 2. Installer les dépendances
npm install
# ou
yarn install

# 3. Configuration des variables d'environnement
cp .env.example .env.local

# 4. Configurer Supabase (voir README.md)
# - Créer un projet Supabase
# - Configurer les variables d'environnement
# - Initialiser la base de données

# 5. Lancer le serveur de développement
npm run dev
# ou
yarn dev
```

### Structure du projet

```
socialcart/
├── 📁 src/
│   ├── 📁 components/     # Composants réutilisables
│   │   ├── 📁 VideoFeed/  # Composants du feed vidéo
│   │   ├── 📁 Layout/     # Structure principale
│   │   └── ...
│   ├── 📁 hooks/         # Hooks personnalisés
│   │   ├── useAuth.tsx
│   │   ├── useCart.tsx
│   │   └── ...
│   ├── 📁 lib/           # Services et clients
│   │   ├── supabase.ts
│   │   ├── products.ts
│   │   └── ...
│   ├── 📁 pages/         # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── Cart.tsx
│   │   └── ...
│   ├── 📁 services/      # Services métier
│   └── 📁 types/         # Définitions TypeScript
├── 📁 supabase/          # Scripts base de données
├── 📁 docs/              # Documentation
├── 📁 tests/             # Tests (à venir)
└── 📁 scripts/           # Scripts de build
```

## 📏 Standards de code

### TypeScript

```typescript
// ✅ Bon
interface UserProps {
  id: string;
  username: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

const UserProfile: React.FC<UserProps> = ({ 
  id, 
  username, 
  avatarUrl, 
  isVerified = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = useCallback(() => {
    setIsLoading(true);
  }, []);
  
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};

// ❌ Éviter
const UserProfile = ({ id, username, avatarUrl }) => {
  // Pas de types, pas de useCallback, etc.
};
```

### React

```typescript
// ✅ Composants fonctionnels avec hooks
export function Component({ prop }: ComponentProps) {
  // Hooks au début
  const [state, setState] = useState();
  const { data, loading } = useQuery();
  
  // Handlers avec useCallback
  const handleClick = useCallback(() => {
    // Logique
  }, [dependency]);
  
  // Effets avec dépendances
  useEffect(() => {
    // Effet
  }, [dependency]);
  
  // Render
  return <div>{/* JSX */}</div>;
}

// ✅ Props avec types explicites
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
  children?: React.ReactNode;
}
```

### CSS / Tailwind

```tsx
// ✅ Classes Tailwind organisées et lisibles
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-lg font-semibold text-gray-900">
    {title}
  </h2>
  <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
    Action
  </button>
</div>

// ✅ Composants avec variants
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Nommage

```typescript
// ✅ Conventions de nommage
// Variables et fonctions : camelCase
const userName = 'john';
const getUserData = () => {};
const isUserVerified = true;

// Composants : PascalCase
const UserProfile = () => {};
const ProductCard = () => {};
const VideoFeed = () => {};

// Types et interfaces : PascalCase
interface UserData {}
type ProductStatus = 'active' | 'inactive' | 'draft';
type VideoQuality = 'low' | 'medium' | 'high';

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.socialcart.app';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;

// Fichiers : kebab-case
user-profile.tsx
product-card.tsx
video-feed.tsx
api-client.ts
```

### Imports

```typescript
// ✅ Organisation des imports
// 1. Imports externes (React, bibliothèques)
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

// 2. Imports internes (composants, hooks, services)
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';
import { ProductService } from '../lib/products';
import { Button } from '../components/Button';

// 3. Imports de types
import type { User, Product, CartItem } from '../types';

// 4. Imports relatifs
import './UserProfile.css';
```

## 🔄 Processus de Pull Request

### Avant de soumettre

- [ ] **Tests** : Vérifier que le code fonctionne
- [ ] **Linting** : `npm run lint` sans erreurs
- [ ] **Types** : TypeScript sans erreurs
- [ ] **Documentation** : Mettre à jour si nécessaire
- [ ] **Commits** : Messages clairs et descriptifs
- [ ] **Performance** : Vérifier l'impact sur les performances
- [ ] **Accessibilité** : Tester avec les lecteurs d'écran

### Template de Pull Request

```markdown
## Description
Brève description des changements apportés.

## Type de changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle feature (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou feature qui causerait un changement de comportement existant)
- [ ] Documentation (changements uniquement dans la documentation)
- [ ] Performance (amélioration des performances)
- [ ] Refactoring (changement de code sans modification fonctionnelle)

## Comment tester
1. Étapes pour tester les changements
2. Résultats attendus
3. Tests automatisés ajoutés

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai ajouté des commentaires si nécessaire
- [ ] Ma modification ne génère pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace
- [ ] Les tests passent localement
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] J'ai vérifié l'accessibilité
- [ ] J'ai testé sur mobile et desktop

## Screenshots (si applicable)
Ajouter des captures d'écran pour les changements UI.

## Références
Lier les issues GitHub concernées.

## Performance
Décrire l'impact sur les performances si applicable.

## Accessibilité
Décrire les améliorations d'accessibilité si applicable.
```

### Processus de review

1. **Review automatique** : CI/CD vérifie le code
2. **Review manuel** : Un mainteneur examine le code
3. **Feedback** : Discussion et améliorations si nécessaire
4. **Approval** : Approbation et merge dans main
5. **Deployment** : Déploiement automatique si tests passent

## 🐛 Rapport de bugs

### Template de bug report

```markdown
## Description du bug
Une description claire et concise du problème.

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler vers '...'
4. Voir l'erreur

## Comportement attendu
Une description claire et concise de ce qui devrait se passer.

## Comportement actuel
Une description claire et concise de ce qui se passe actuellement.

## Screenshots
Si applicable, ajouter des captures d'écran.

## Environnement
- OS: [ex. iOS, Android, Windows, macOS]
- Navigateur: [ex. Chrome, Safari, Firefox]
- Version: [ex. 22]
- Version de l'app: [ex. 1.0.0]
- Résolution d'écran: [ex. 1920x1080]

## Logs
Ajouter les logs de la console si applicable.

## Informations additionnelles
Toute autre information pertinente.
```

### Priorité des bugs

- 🔴 **Critique** : App crash, perte de données, faille de sécurité
- 🟡 **Majeur** : Fonctionnalité cassée, mauvaise UX, performance dégradée
- 🟢 **Mineur** : Problème cosmétique, amélioration, suggestion

## 💡 Propositions de fonctionnalités

### Template de feature request

```markdown
## Résumé
Une description claire et concise de la fonctionnalité souhaitée.

## Motivation
Pourquoi cette fonctionnalité serait-elle utile ? Quel problème résout-elle ?

## Description détaillée
Une description détaillée de la fonctionnalité et de son comportement attendu.

## Alternatives considérées
Décrire les solutions alternatives que vous avez considérées.

## Implémentation (optionnel)
Si vous avez des idées sur l'implémentation, les partager ici.

## Impact utilisateur
Comment cette fonctionnalité améliorerait l'expérience utilisateur ?

## Impact technique
Quel serait l'impact sur l'architecture et les performances ?

## Priorité
- [ ] Critique (bloque d'autres fonctionnalités)
- [ ] Haute (améliore significativement l'UX)
- [ ] Moyenne (amélioration nice-to-have)
- [ ] Basse (bon à avoir)

## Exemples d'utilisation
Fournir des exemples concrets d'utilisation.

## Mockups/Wireframes (optionnel)
Ajouter des maquettes si applicable.
```

### Processus d'évaluation

1. **Discussion** : Évaluer la pertinence et la faisabilité
2. **Priorisation** : Déterminer la priorité selon la roadmap
3. **Planning** : Intégrer dans le planning de développement
4. **Implémentation** : Assigner à un développeur
5. **Review** : Validation et tests
6. **Release** : Déploiement et documentation

## 🧪 Tests et Qualité

### Tests unitaires (à venir)

```typescript
// Exemple de test avec Vitest
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('affiche le nom d\'utilisateur', () => {
    render(<UserProfile username="john" />);
    expect(screen.getByText('john')).toBeInTheDocument();
  });

  it('affiche le badge de vérification si vérifié', () => {
    render(<UserProfile username="john" isVerified={true} />);
    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });

  it('gère le clic sur le bouton de suivi', () => {
    const mockOnFollow = jest.fn();
    render(<UserProfile username="john" onFollow={mockOnFollow} />);
    
    fireEvent.click(screen.getByRole('button', { name: /suivre/i }));
    expect(mockOnFollow).toHaveBeenCalledTimes(1);
  });
});
```

### Tests d'intégration

```typescript
// Test d'intégration avec React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cart } from './Cart';
import { CartProvider } from '../hooks/useCart';

describe('Cart Integration', () => {
  it('ajoute un produit au panier', async () => {
    render(
      <CartProvider>
        <Cart />
      </CartProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Produit ajouté')).toBeInTheDocument();
    });
  });
});
```

### Tests E2E (optionnel)

```typescript
// Test E2E avec Playwright
import { test, expect } from '@playwright/test';

test('flux d\'achat complet', async ({ page }) => {
  await page.goto('/');
  
  // Naviguer dans le feed vidéo
  await page.click('[data-testid="video-feed"]');
  
  // Ajouter un produit au panier
  await page.click('[data-testid="add-to-cart"]');
  
  // Aller au panier
  await page.click('[data-testid="cart-button"]');
  
  // Vérifier que le produit est dans le panier
  await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  
  // Procéder au paiement
  await page.click('[data-testid="checkout-button"]');
  
  // Vérifier la page de paiement
  await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
});
```

### Qualité du code

```typescript
// ✅ Code de qualité avec gestion d'erreur
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// ✅ Code avec validation
export function validateProductData(data: CreateProductData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Le nom du produit doit contenir au moins 3 caractères');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Le prix doit être supérieur à 0');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## 📝 Documentation

### Documentation du code

```typescript
/**
 * Composant UserProfile - Affiche le profil d'un utilisateur
 * 
 * @param props - Props du composant
 * @param props.user - Données de l'utilisateur
 * @param props.showActions - Afficher les boutons d'action
 * @param props.onEdit - Callback appelé lors de l'édition
 * @param props.onFollow - Callback appelé lors du suivi
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   user={userData} 
 *   showActions={true}
 *   onEdit={() => console.log('Edit clicked')}
 *   onFollow={() => console.log('Follow clicked')}
 * />
 * ```
 */
export function UserProfile({ 
  user, 
  showActions = false, 
  onEdit, 
  onFollow 
}: UserProfileProps) {
  // Implementation
}
```

### Documentation des API

```typescript
/**
 * Service pour la gestion des produits
 */
export class ProductService {
  /**
   * Récupère la liste des produits avec filtres optionnels
   * 
   * @param filters - Filtres optionnels pour la recherche
   * @param filters.category - ID de la catégorie
   * @param filters.minPrice - Prix minimum
   * @param filters.maxPrice - Prix maximum
   * @param filters.search - Terme de recherche
   * @param filters.limit - Nombre maximum de résultats
   * @param filters.offset - Décalage pour la pagination
   * @returns Promise<Product[]> - Liste des produits
   * 
   * @throws {Error} Si la requête échoue
   * 
   * @example
   * ```typescript
   * const products = await ProductService.getProducts({
   *   category: 'electronics',
   *   priceRange: { min: 100, max: 500 },
   *   search: 'iphone',
   *   limit: 20
   * });
   * ```
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // Implementation
  }
}
```

### Documentation des composants

```markdown
# VideoFeed Component

## Description
Composant principal pour l'affichage du feed vidéo social avec navigation par swipe.

## Props
- `products: VideoFeedProduct[]` - Liste des produits à afficher
- `onProductSelect?: (product: Product) => void` - Callback lors de la sélection d'un produit

## Usage
```tsx
import { VideoFeed } from './VideoFeed';

<VideoFeed 
  products={products}
  onProductSelect={(product) => console.log('Selected:', product)}
/>
```

## Fonctionnalités
- Navigation par swipe vertical
- Autoplay intelligent
- Gestion des gestes tactiles
- Optimisation des performances
```

## 🏷️ Versioning et Releases

### Semantic Versioning

- **MAJOR** (1.0.0) : Breaking changes
- **MINOR** (0.1.0) : Nouvelles fonctionnalités compatibles
- **PATCH** (0.0.1) : Corrections de bugs

### Processus de release

1. **Feature freeze** : Arrêt des nouvelles fonctionnalités
2. **Testing** : Tests intensifs et validation
3. **Documentation** : Mise à jour de la documentation
4. **Release notes** : Préparation des notes de version
5. **Deployment** : Déploiement en production
6. **Monitoring** : Surveillance des métriques post-release

### Branches

- **main** : Branche principale stable
- **develop** : Branche de développement
- **feature/*** : Branches de fonctionnalités
- **bugfix/*** : Branches de corrections
- **hotfix/*** : Branches de corrections urgentes

## 🆘 Support et Aide

### Obtenir de l'aide

- **GitHub Issues** : Pour les bugs et feature requests
- **GitHub Discussions** : Pour les questions générales
- **Discord** : Pour le chat en temps réel (à venir)
- **Email** : support@socialcart.app

### Ressources utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Framer Motion](https://www.framer.com/motion/)

### Communauté

- **Discord** : Rejoignez notre serveur Discord pour échanger avec la communauté
- **Twitter** : Suivez @SocialCartApp pour les dernières nouvelles
- **Blog** : Lisez notre blog technique sur les dernières innovations
- **Newsletter** : Abonnez-vous à notre newsletter mensuelle

## 🙏 Remerciements

Merci à tous les contributeurs qui participent à faire de SocialCart une plateforme exceptionnelle !

### Contributeurs actifs

<!-- Liste des contributeurs sera mise à jour automatiquement -->

### Reconnaissance

- **Contributeurs** : Merci à tous ceux qui participent au développement
- **Testeurs** : Merci aux utilisateurs qui testent et rapportent les bugs
- **Documentation** : Merci à ceux qui améliorent la documentation
- **Design** : Merci aux designers qui améliorent l'UX/UI

---

**Ensemble, construisons l'avenir du commerce social !** 🚀

*Ce guide est un document vivant qui évolue avec le projet. N'hésitez pas à proposer des améliorations via une issue ou une pull request !*