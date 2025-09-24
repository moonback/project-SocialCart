# Guide de Débogage - Produits Associés

## Problème
Les produits associés ne s'affichent pas dans la page de détail du produit.

## Solutions Implémentées

### 1. Amélioration du Service des Produits
- ✅ Nouvelle méthode `getSuggestedProducts()` dans `ProductService`
- ✅ Filtrage par catégorie et exclusion du produit actuel
- ✅ Limite configurable (par défaut 4 produits)

### 2. Amélioration de l'Affichage
- ✅ Affichage conditionnel des suggestions
- ✅ Compteur de produits suggérés
- ✅ Message informatif si aucune suggestion
- ✅ Logs de débogage dans la console

### 3. Script de Vérification
- ✅ `scripts/check-products.sql` pour vérifier la base de données
- ✅ Création automatique de produits de test si nécessaire

## Étapes de Débogage

### 1. Vérifier la Base de Données
```sql
-- Exécuter dans Supabase SQL Editor
-- Copier le contenu de scripts/check-products.sql
```

### 2. Vérifier les Logs
1. Ouvrir la console du navigateur (F12)
2. Aller sur une page de produit
3. Chercher les logs :
   - "Chargement des suggestions..."
   - "Produits suggérés récupérés: X"

### 3. Vérifier les Données
- S'assurer qu'il y a au moins 2 produits actifs
- Vérifier que les produits ont des catégories
- Vérifier que les images sont correctement configurées

## Tests à Effectuer

### Test 1: Produits de Base
- [ ] Créer au moins 5 produits de test
- [ ] Vérifier qu'ils sont actifs (status = 'active')
- [ ] Vérifier qu'ils ont des images

### Test 2: Catégories
- [ ] Créer des catégories si nécessaire
- [ ] Assigner des catégories aux produits
- [ ] Vérifier que les suggestions priorisent la même catégorie

### Test 3: Interface
- [ ] Vérifier l'affichage des suggestions
- [ ] Vérifier le message "Aucun produit similaire trouvé"
- [ ] Vérifier le compteur de produits

## Commandes Utiles

### Vérifier les Produits
```sql
SELECT COUNT(*) FROM products WHERE status = 'active';
```

### Vérifier les Catégories
```sql
SELECT COUNT(*) FROM categories;
```

### Créer des Produits de Test
```sql
-- Utiliser le script scripts/check-products.sql
```

## Prochaines Étapes

1. **Exécuter le script de vérification** dans Supabase
2. **Tester l'affichage** des suggestions
3. **Vérifier les logs** dans la console
4. **Créer des produits de test** si nécessaire

## Notes Techniques

- Les suggestions sont chargées après le produit principal
- Priorité aux produits de la même catégorie
- Fallback vers tous les produits si pas de catégorie
- Limite de 4 produits suggérés
- Conversion automatique des données Supabase vers le format Product
