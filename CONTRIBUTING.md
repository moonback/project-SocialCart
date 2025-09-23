# 🤝 Guide de Contribution - Shopping Connect

## Bienvenue !

Merci de votre intérêt pour contribuer à **Shopping Connect** ! Ce guide vous aidera à comprendre notre processus de développement et à contribuer efficacement au projet.

## 📋 Prérequis

### Outils Requis
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** pour le versioning
- **VS Code** (recommandé) avec extensions :
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

### Comptes Nécessaires
- **GitHub** pour le code
- **Supabase** pour la base de données (compte gratuit)
- **Vercel/Netlify** pour le déploiement (optionnel)

## 🚀 Configuration du Projet

### 1. Fork et Clone
```bash
# Fork le repository sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/shopping-connect.git
cd shopping-connect

# Ajouter le repository upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/shopping-connect.git
```

### 2. Installation
```bash
# Installer les dépendances
npm install
# ou
yarn install

# Copier les variables d'environnement
cp .env.example .env.local
```

### 3. Configuration Supabase
1. Créer un projet Supabase
2. Configurer `.env.local` :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
3. Exécuter le schéma SQL dans Supabase SQL Editor

### 4. Lancement en Développement
```bash
npm run dev
# ou
yarn dev
```

## 🎯 Types de Contributions

### 🐛 Bug Reports
- **Problèmes existants** dans le code
- **Erreurs de fonctionnement** des fonctionnalités
- **Problèmes de performance** ou d'UX
- **Bugs visuels** ou de responsive

### ✨ Feature Requests
- **Nouvelles fonctionnalités** pour améliorer l'app
- **Améliorations UX/UI** existantes
- **Optimisations** de performance
- **Intégrations** avec des services externes

### 📚 Documentation
- **Amélioration** de la documentation existante
- **Tutoriels** et guides d'utilisation
- **Exemples** de code et cas d'usage
- **Traductions** en d'autres langues

### 🎨 Design & UX
- **Améliorations** du design system
- **Nouvelles animations** et micro-interactions
- **Optimisations** mobile-first
- **Accessibilité** et inclusivité

## 🔄 Workflow de Contribution

### 1. Créer une Issue
Avant de commencer à coder :
1. **Vérifier** si l'issue existe déjà
2. **Créer une issue** détaillée avec :
   - Description claire du problème/feature
   - Étapes de reproduction (pour les bugs)
   - Mockups/wireframes (pour les features)
   - Labels appropriés

### 2. Créer une Branch
```bash
# Synchroniser avec upstream
git fetch upstream
git checkout main
git merge upstream/main

# Créer une nouvelle branch
git checkout -b feature/nom-de-la-feature
# ou
git checkout -b fix/nom-du-bug
# ou
git checkout -b docs/nom-de-la-doc
```

### 3. Développement

#### **Standards de Code**
```typescript
// ✅ Bon exemple
interface UserProps {
  id: string;
  username: string;
  avatarUrl?: string;
}

export function UserCard({ id, username, avatarUrl }: UserProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = useCallback(() => {
    // Logique métier
  }, []);
  
  return (
    <div className="user-card">
      {/* JSX */}
    </div>
  );
}

// ❌ Mauvais exemple
export function UserCard(props: any) {
  const [loading, setLoading] = useState(false);
  
  return <div>{/* JSX sans structure */}</div>;
}
```

#### **Conventions de Nommage**
- **Composants** : PascalCase (`UserCard`, `ProductList`)
- **Fonctions** : camelCase (`getUserData`, `handleSubmit`)
- **Variables** : camelCase (`userName`, `isLoading`)
- **Constantes** : UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- **Fichiers** : PascalCase pour composants, camelCase pour utils

#### **Structure des Composants**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Composant principal
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effets
  useEffect(() => {
    // Logique
  }, []);
  
  // 6. Handlers
  const handleAction = () => {
    // Logique
  };
  
  // 7. Rendu
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}
```

### 4. Tests et Validation

#### **Tests Manuels**
- [ ] **Fonctionnalité** testée sur mobile et desktop
- [ ] **Responsive** vérifié sur différentes tailles
- [ ] **Performance** acceptable (< 2s chargement)
- [ ] **Accessibilité** de base respectée
- [ ] **Cross-browser** testé (Chrome, Firefox, Safari)

#### **Linting et Formatting**
```bash
# Vérifier le linting
npm run lint
# ou
yarn lint

# Auto-fix si possible
npm run lint -- --fix
# ou
yarn lint --fix
```

### 5. Commit et Push
```bash
# Ajouter les fichiers modifiés
git add .

# Commit avec message descriptif
git commit -m "feat: add user profile picture upload

- Add ProfileImageUploader component
- Implement drag & drop functionality
- Add image validation and preview
- Update user avatar in database
- Add error handling and loading states"

# Push vers votre fork
git push origin feature/nom-de-la-feature
```

#### **Convention de Commits**
Utiliser le format **Conventional Commits** :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, pas de changement de code
- `refactor:` refactoring de code
- `test:` ajout de tests
- `chore:` tâches de maintenance

### 6. Pull Request

#### **Créer la PR**
1. Aller sur GitHub
2. Cliquer "Compare & pull request"
3. Remplir le template de PR

#### **Template de PR**
```markdown
## 📝 Description
Brève description des changements apportés.

## 🔗 Issue liée
Fixes #123

## 🧪 Tests
- [ ] Tests manuels effectués
- [ ] Fonctionnalité testée sur mobile/desktop
- [ ] Performance vérifiée
- [ ] Aucune régression détectée

## 📸 Screenshots
Ajouter des captures d'écran si applicable.

## 📋 Checklist
- [ ] Code respecte les standards du projet
- [ ] Documentation mise à jour si nécessaire
- [ ] Tests passent
- [ ] PR est à jour avec main
```

## 🎨 Guidelines de Design

### Design System
- **Couleurs** : Utiliser la palette définie dans `tailwind.config.js`
- **Typographie** : Inter comme police principale
- **Espacement** : Système de spacing cohérent
- **Animations** : Framer Motion pour les transitions

### Composants UI
```typescript
// ✅ Utiliser les classes Tailwind cohérentes
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
  Action
</button>

// ✅ Utiliser les composants existants
<UserAvatar 
  avatarUrl={user.avatarUrl} 
  username={user.username} 
  size="md" 
/>
```

### Responsive Design
```typescript
// ✅ Mobile-first approach
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">
    {/* Contenu */}
  </div>
</div>
```

## 🧪 Tests et Qualité

### Tests Manuels
1. **Fonctionnalité principale** : Vérifier que la feature fonctionne
2. **Cas d'erreur** : Tester les cas d'échec
3. **Performance** : Mesurer les temps de chargement
4. **UX** : Vérifier l'expérience utilisateur

### Code Review Checklist
- [ ] **Code lisible** et bien commenté
- [ ] **Types TypeScript** corrects
- [ ] **Gestion d'erreurs** appropriée
- [ ] **Performance** optimisée
- [ ] **Sécurité** respectée
- [ ] **Accessibilité** de base

## 🚀 Déploiement et Release

### Branches
- **`main`** : Code de production stable
- **`develop`** : Intégration des features
- **`feature/*`** : Nouvelles fonctionnalités
- **`fix/*`** : Corrections de bugs
- **`hotfix/*`** : Corrections urgentes

### Processus de Release
1. **Merge** vers `main` après review
2. **Tests** de régression
3. **Déploiement** automatique via CI/CD
4. **Monitoring** des métriques post-release

## 📞 Communication

### Channels de Communication
- **GitHub Issues** : Bugs et features
- **GitHub Discussions** : Questions générales
- **Pull Requests** : Reviews et discussions techniques

### Code Review Guidelines
- **Constructif** : Proposer des améliorations
- **Respectueux** : Maintenir un ton professionnel
- **Détaillé** : Expliquer les suggestions
- **Apprendre** : Utiliser les reviews comme opportunité d'apprentissage

## 🎓 Ressources d'Apprentissage

### Documentation Technique
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Outils de Développement
- [VS Code Extensions](https://code.visualstudio.com/docs)
- [Git Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

## 🏆 Reconnaissance

### Types de Contributions Reconnues
- **Code** : Nouvelles fonctionnalités et corrections
- **Documentation** : Guides et tutoriels
- **Design** : Améliorations UX/UI
- **Tests** : Tests et qualité
- **Community** : Aide aux autres contributeurs

### Système de Reconnaissance
- **Contributeurs** listés dans le README
- **Badges** GitHub pour les contributions
- **Mentions** dans les releases
- **Accès** aux discussions privées pour les contributeurs actifs

## ❓ Questions Fréquentes

### Q: Comment choisir une issue à travailler ?
**R:** Commencer par les issues labellisées `good first issue` ou `help wanted`. Vérifier que personne d'autre ne travaille dessus.

### Q: Que faire si je suis bloqué ?
**R:** Créer une issue avec le label `question` ou demander de l'aide dans les discussions GitHub.

### Q: Comment proposer une nouvelle fonctionnalité ?
**R:** Créer une issue avec le label `enhancement` et fournir des détails, mockups si possible.

### Q: Puis-je contribuer sans coder ?
**R:** Oui ! Documentation, design, tests, et aide communautaire sont très appréciés.

---

Merci de contribuer à Shopping Connect ! Ensemble, nous créons l'avenir du shopping vidéo social. 🚀

Pour toute question, n'hésitez pas à ouvrir une issue ou une discussion sur GitHub.
