# 🔧 Résolution des Problèmes - Stories Produit

## 🚨 Problèmes Identifiés et Solutions

### 1. Erreur 403 Forbidden sur product_stories

**Problème :** `POST https://tcjtlvmrndjcfexlaffk.supabase.co/rest/v1/product_stories 403 (Forbidden)`

**Cause :** Les politiques RLS (Row Level Security) sont trop restrictives ou mal configurées.

**Solution :**
```sql
-- Exécuter dans Supabase SQL Editor
\i supabase/FIX_RLS_POLICIES.sql
```

### 2. Erreur 42501 sur notifications

**Problème :** `new row violates row-level security policy for table "notifications"`

**Cause :** Les triggers de notification tentent d'insérer dans la table notifications mais les politiques RLS l'empêchent.

**Solution :** Le script `FIX_RLS_POLICIES.sql` corrige automatiquement ce problème.

### 3. Erreur des icônes PWA

**Problème :** `Error while trying to use the following icon from the Manifest: http://localhost:3000/icons/icon-144x144.png`

**Cause :** Les fichiers d'icônes ne sont pas correctement servis par le serveur de développement.

**Solution :**
1. Ouvrir `http://localhost:3000/clear-cache.html`
2. Cliquer sur "Tester les Icônes"
3. Si erreur, cliquer sur "Tout Nettoyer" puis "Recharger la Page"

## 📋 Checklist de Résolution

### ✅ Étape 1 : Corriger la Base de Données
- [ ] Exécuter `supabase/FIX_RLS_POLICIES.sql` dans Supabase SQL Editor
- [ ] Vérifier que les tables `product_stories`, `story_views`, `story_interactions`, `notifications` existent
- [ ] Vérifier que les politiques RLS sont permissives (temporairement)

### ✅ Étape 2 : Tester la Création de Stories
- [ ] Se connecter en tant qu'utilisateur vendeur
- [ ] Aller sur la page d'accueil
- [ ] Cliquer sur le bouton "+" dans la barre des stories
- [ ] Sélectionner un produit
- [ ] Uploader une image/vidéo
- [ ] Publier la story

### ✅ Étape 3 : Corriger les Icônes PWA
- [ ] Ouvrir `http://localhost:3000/clear-cache.html`
- [ ] Tester les icônes
- [ ] Nettoyer le cache si nécessaire
- [ ] Recharger la page

### ✅ Étape 4 : Vérifier les Notifications
- [ ] Créer une story
- [ ] Vérifier que les notifications sont créées
- [ ] Tester les interactions (like, partage, vue)

## 🔍 Debug et Logs

### Console du Navigateur
Vérifier la console pour :
- Erreurs 403/42501 (problèmes RLS)
- Erreurs de chargement d'icônes
- Erreurs de service worker

### Supabase Dashboard
Vérifier dans Supabase :
- Tables créées correctement
- Politiques RLS actives
- Triggers fonctionnels
- Logs des requêtes

### Outils de Debug
- `http://localhost:3000/debug-sw.html` - Debug service worker
- `http://localhost:3000/clear-cache.html` - Nettoyage cache
- `http://localhost:3000/test-icons.html` - Test icônes

## 🚀 Solutions Rapides

### Solution 1 : Désactiver RLS Temporairement
```sql
-- Dans Supabase SQL Editor
ALTER TABLE public.product_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
```

### Solution 2 : Politiques Permissives
```sql
-- Créer des politiques permissives pour le développement
CREATE POLICY "Allow all operations" ON public.product_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.story_views FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.story_interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
```

### Solution 3 : Nettoyer le Cache
```javascript
// Dans la console du navigateur
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
}

if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(name => caches.delete(name));
  });
}

localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🔒 Sécurité en Production

⚠️ **Important :** Les politiques permissives sont uniquement pour le développement. En production, utilisez des politiques strictes :

```sql
-- Politiques strictes pour la production
CREATE POLICY "Users can view stories from followed users" ON public.product_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() 
      AND following_id = seller_id
    ) OR seller_id = auth.uid()
  );

CREATE POLICY "Users can create stories for their products" ON public.product_stories
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifier les logs Supabase** dans le dashboard
2. **Tester avec des données simples** (un utilisateur, un produit)
3. **Vérifier les permissions** de l'utilisateur connecté
4. **Consulter la documentation Supabase** sur RLS

## 🎯 Test Final

Une fois les corrections appliquées, vous devriez pouvoir :

- ✅ Créer des stories sans erreur 403/42501
- ✅ Voir les icônes PWA correctement
- ✅ Recevoir des notifications
- ✅ Interagir avec les stories (like, partage, vue)
- ✅ Voir les statistiques dans le profil

---

🎉 **Une fois tous les problèmes résolus, votre système de stories sera pleinement fonctionnel !**
