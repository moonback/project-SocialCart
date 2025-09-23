# 🤝 Guide de Contribution - SocialCart

## Bienvenue ! 👋

Merci de votre intérêt pour contribuer à **SocialCart** ! Ce guide vous aidera à comprendre comment participer au développement de la plateforme.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Setup de développement](#setup-de-développement)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapport de bugs](#rapport-de-bugs)
- [Propositions de fonctionnalités](#propositions-de-fonctionnalités)

## 📜 Code de conduite

### Notre engagement

Nous nous engageons à offrir une expérience de contribution ouverte et accueillante pour tous, indépendamment de l'âge, de la taille, du handicap, de l'ethnicité, de l'identité et de l'expression de genre, du niveau d'expérience, de l'éducation, du statut socio-économique, de la nationalité, de l'apparence personnelle, de la race, de la religion ou de l'orientation sexuelle.

### Comportements attendus

- **Respect mutuel** et communication constructive
- **Empathie** envers les autres points de vue
- **Acceptation** des critiques constructives
- **Focus** sur ce qui est le mieux pour la communauté
- **Respect** des autres contributeurs

### Comportements inacceptables

- **Langage** ou images sexualisés ou violents
- **Trolling**, commentaires insultants ou désobligeants
- **Harcèlement** public ou privé
- **Publishing** d'informations privées sans permission
- **Comportement** non professionnel

## 🚀 Comment contribuer

### Types de contributions

#### 🐛 Correction de bugs
- Identifier et corriger des problèmes existants
- Améliorer la gestion d'erreurs
- Optimiser les performances

#### ✨ Nouvelles fonctionnalités
- Implémenter des features demandées
- Améliorer l'expérience utilisateur
- Ajouter de nouveaux composants

#### 📚 Documentation
- Améliorer la documentation existante
- Ajouter des exemples de code
- Traduire la documentation

#### 🧪 Tests
- Ajouter des tests unitaires
- Implémenter des tests d'intégration
- Améliorer la couverture de tests

#### 🎨 Design
- Améliorer l'interface utilisateur
- Optimiser l'expérience mobile
- Créer de nouveaux assets

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
│   ├── 📁 hooks/         # Hooks personnalisés
│   ├── 📁 lib/           # Services et utilitaires
│   ├── 📁 pages/         # Pages de l'application
│   └── 📁 types/         # Définitions TypeScript
├── 📁 supabase/          # Scripts base de données
├── 📁 docs/              # Documentation
└── 📁 tests/             # Tests (à venir)
```

## 📏 Standards de code

### TypeScript

```typescript
// ✅ Bon
interface UserProps {
  id: string;
  username: string;
  avatarUrl?: string;
}

const UserProfile: React.FC<UserProps> = ({ id, username, avatarUrl }) => {
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
// ✅ Composants fonctionnels
export function Component({ prop }: ComponentProps) {
  // Hooks au début
  const [state, setState] = useState();
  
  // Handlers avec useCallback
  const handleClick = useCallback(() => {
    // Logique
  }, []);
  
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
}
```

### CSS / Tailwind

```tsx
// ✅ Classes Tailwind organisées
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

// Composants : PascalCase
const UserProfile = () => {};
const ProductCard = () => {};

// Types et interfaces : PascalCase
interface UserData {}
type ProductStatus = 'active' | 'inactive';

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Fichiers : kebab-case
user-profile.tsx
product-card.tsx
api-client.ts
```

### Imports

```typescript
// ✅ Organisation des imports
// 1. Imports externes (React, bibliothèques)
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// 2. Imports internes (composants, hooks, services)
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';
import { ProductService } from '../lib/products';

// 3. Imports de types
import type { User, Product } from '../types';

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

### Template de Pull Request

```markdown
## Description
Brève description des changements apportés.

## Type de changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle feature (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou feature qui causerait un changement de comportement existant)
- [ ] Documentation (changements uniquement dans la documentation)

## Comment tester
1. Étapes pour tester les changements
2. Résultats attendus

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai ajouté des commentaires si nécessaire
- [ ] Ma modification ne génère pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace
- [ ] Les tests passent localement
- [ ] J'ai mis à jour la documentation si nécessaire

## Screenshots (si applicable)
Ajouter des captures d'écran pour les changements UI.

## Références
Lier les issues GitHub concernées.
```

### Processus de review

1. **Review automatique** : CI/CD vérifie le code
2. **Review manuel** : Un mainteneur examine le code
3. **Feedback** : Discussion et améliorations si nécessaire
4. **Approval** : Approbation et merge dans main

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

## Screenshots
Si applicable, ajouter des captures d'écran.

## Environnement
- OS: [ex. iOS, Android, Windows, macOS]
- Navigateur: [ex. Chrome, Safari, Firefox]
- Version: [ex. 22]
- Version de l'app: [ex. 1.0.0]

## Informations additionnelles
Toute autre information pertinente.
```

### Priorité des bugs

- 🔴 **Critique** : App crash, perte de données
- 🟡 **Majeur** : Fonctionnalité cassée, mauvaise UX
- 🟢 **Mineur** : Problème cosmétique, amélioration

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

## Priorité
- [ ] Critique (bloque d'autres fonctionnalités)
- [ ] Haute (améliore significativement l'UX)
- [ ] Moyenne (amélioration nice-to-have)
- [ ] Basse (bon à avoir)
```

### Processus d'évaluation

1. **Discussion** : Évaluer la pertinence et la faisabilité
2. **Priorisation** : Déterminer la priorité selon la roadmap
3. **Planning** : Intégrer dans le planning de développement
4. **Implémentation** : Assigner à un développeur

## 🧪 Tests

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
});
```

### Tests d'intégration

```typescript
// Test d'intégration avec React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Cart } from './Cart';

describe('Cart Integration', () => {
  it('ajoute un produit au panier', async () => {
    render(<Cart />);
    
    const addButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Produit ajouté')).toBeInTheDocument();
  });
});
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
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   user={userData} 
 *   showActions={true}
 *   onEdit={() => console.log('Edit clicked')}
 * />
 * ```
 */
export function UserProfile({ user, showActions, onEdit }: UserProfileProps) {
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
   * Récupère la liste des produits
   * 
   * @param filters - Filtres optionnels pour la recherche
   * @returns Promise<Product[]> - Liste des produits
   * 
   * @throws {Error} Si la requête échoue
   * 
   * @example
   * ```typescript
   * const products = await ProductService.getProducts({
   *   category: 'electronics',
   *   priceRange: { min: 100, max: 500 }
   * });
   * ```
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // Implementation
  }
}
```

## 🏷️ Versioning et Releases

### Semantic Versioning

- **MAJOR** (1.0.0) : Breaking changes
- **MINOR** (0.1.0) : Nouvelles fonctionnalités compatibles
- **PATCH** (0.0.1) : Corrections de bugs

### Processus de release

1. **Feature freeze** : Arrêt des nouvelles fonctionnalités
2. **Testing** : Tests intensifs
3. **Documentation** : Mise à jour de la documentation
4. **Release notes** : Préparation des notes de version
5. **Deployment** : Déploiement en production

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

## 🙏 Remerciements

Merci à tous les contributeurs qui participent à faire de SocialCart une plateforme exceptionnelle !

### Contributeurs actifs

<!-- Liste des contributeurs sera mise à jour automatiquement -->

---

**Ensemble, construisons l'avenir du commerce social !** 🚀

*Ce guide est un document vivant qui évolue avec le projet. N'hésitez pas à proposer des améliorations !*