# Brainstorming - VacancesEnVue

> **Document de Référence - À NE PAS SUPPRIMER** ⚠️
>
> Ce document documente les décisions initiales du projet.
> Il sert de référence tout au long du développement.

---

## Contexte du Projet

### Problème Résolu

Parents, élèves et enseignants veulent savoir facilement combien de temps reste avant les prochaines vacances scolaires françaises. Actuellement, ils doivent :
- Consulter le calendrier scolaire officiel (site éducation.gouv)
- Calculer mentalement le nombre de jours restants
- Identifier quelle zone correspond à leur région

**VacancesEnVue simplifie cela** : Une app mobile qui affiche le compte à rebours automatiquement, avec détection automatique de l'académie.

---

## Importance du Projet

### Valeur Ajoutée

1. **Détection Automatique** : Pas de saisie manuelle, géolocalisation GPS
2. **Temps Réel** : Compte à rebours dynamique (jours, heures, minutes, secondes)
3. **Engagement** : Interface colorée et fun (thème Summer)
4. **Mobile-First** : Expérience optimale sur smartphone

### Cas d'Usage Principal

Un parent consulte l'app sur son téléphone le matin avant d'envoyer ses enfants à l'école → L'app détecte sa position via GPS, identifie son académie, affiche "Prochaines vacances dans 42 jours 15 heures 32 minutes 08 secondes" avec design attrayant.

---

## Utilisateurs Cibles

| Type | Profil | Besoin | Frequency |
|------|--------|--------|-----------|
| **Parents** | 25-50 ans | Savoir quand c'est les vacances | 1-2x/semaine |
| **Élèves** | 6-18 ans | Compter les jours avant les vacances | 1x/jour ou + |
| **Enseignants** | 25-65 ans | Référence rapide du calendrier | 1-2x/semaine |

---

## Contraintes & Particularités

### Techniques

1. **Mobile-First Obligatoire** : Priorité au smartphone (iOS/Android)
2. **Détection Automatique GPS** : Via Geolocation API du navigateur
3. **HTTPS Requis** : Pour la géolocalisation (sauf localhost)
4. **Stack Vite + React + TypeScript** : Déjà initialisée
5. **shadcn/ui Obligatoire** : Thème Summer exclusivement
6. **Tailwind CSS v4** : À installer

### Métier

1. **30 académies françaises** : Besançon, Bordeaux, Clermont-Ferrand, Dijon, Grenoble, Limoges, Lyon, Poitiers (A), Aix-Marseille, Amiens, Caen, Lille, Nancy-Metz, Nantes, Nice, Orléans-Tours, Reims, Rennes, Rouen, Strasbourg (B), Créteil, Montpellier, Paris, Toulouse, Versailles (C), + 5 spéciales
2. **3 zones scolaires** : A, B, C (vacances différentes selon zone)
3. **API Gouvernementale** : https://data.gouv.fr/ (calendrier officiel)
4. **Jours Fériés** : Certaines vacances identiques pour toutes les zones (Noël, Toussaint, été)

### Deadline

⏰ **24 janvier 2025, 23:59** - Très proche !

---

## Points Clés Décidés

### 1. Architecture

**Pattern** : Component-Based React avec Hooks
- ✅ Modern, maintenable, scalable
- ✅ Optimisé pour performance
- ✅ Facile à tester

**State Management** : React Hooks + Context (pas Redux)
- ✅ Léger pour une app simple
- ✅ Pas de boilerplate
- ✅ Parfait pour l'app

### 2. UI/Design

**Framework** : shadcn/ui + Tailwind CSS v4 + Thème Summer
- ✅ Design cohérent et professionnel
- ✅ Composants pré-stylisés et accessibles
- ✅ Thème "Summer" = couleurs chaudes et estivales
- ✅ Mobile-first par défaut

**Style** : Coloré et engageant
- Palette chaude (orange, jaune, soleil)
- Animations subtiles
- Responsive 320px à 1920px

### 3. Données

**Source** : API Officielle data.gouv.fr (calendrier-scolaire)
- ✅ Données officielles et à jour
- ✅ Gratuit et public
- ✅ Fiable

**Caching** : localStorage 24h
- ✅ Réduit les appels API
- ✅ Améliore les performances
- ✅ Fonctionne offline

### 4. Géolocalisation

**Implémentation** : Geolocation API du navigateur
- ✅ Natif, pas de dépendance externe
- ✅ Demande de permission à l'utilisateur
- ✅ Fallback manuel (dropdown académies)

**Fallback** : Si géolocalisation échoue → Sélection manuelle
- ✅ UX robuste
- ✅ Pas de frustration utilisateur
- ✅ Toujours utilisable

### 5. Performance

**Target** : Lighthouse score > 85 sur mobile
- Lazy loading des composants
- Code splitting Vite
- Minification assets
- Cache API 24h

---

## Décisions Importantes

### ✅ Outils MCP Obligatoires

**shadcn/ui MCP** :
- EXCLUSIVEMENT pour tous les composants UI
- JAMAIS créer de composants from scratch
- Thème Summer appliqué partout

**Context7 MCP** :
- Consulter pour React, Vite, TypeScript, Tailwind
- Garder la doc à jour

### ✅ TypeScript Strict

- Mode strict activé
- Pas de `any` non justifié
- Types complets partout

### ✅ Conventional Commits

- Format `type(scope): description`
- Types : feat, fix, refactor, style, docs, test, chore
- Versioning sémantique

### ✅ Testing

- Tests unitaires pour hooks et utilitaires
- Tests manuels responsive (375px, 768px, 1024px+)
- Validation avec Lighthouse

---

## Risques & Mitigation

| Risque | Probability | Impact | Mitigation |
|--------|-------------|--------|-----------|
| Géolocalisation échoue | Moyenne | Moyen | Sélection manuelle + messages clairs |
| API Calendrier Down | Faible | Fort | Cache 24h + messages d'erreur |
| Performance dégradée | Faible | Moyen | Lighthouse > 85 + lazy loading |
| Mobile-first oublié | Moyenne | Moyen | Tests réguliers 375px |
| Deadline trop serrée | Haute | Fort | Planification stricte + AIDD |

---

## Choix Techniques Justifiés

### Pourquoi Vite + React ?

- Vite : Build ultra-rapide (< 100ms), HMR instantan
- React 19 : Dernier, stable, grande communauté
- Combos = expérience dev excellente

### Pourquoi pas Next.js / Nuxt ?

- Trop lourd pour une app simple (pas de backend)
- SPA suffisante (pas SEO requise)
- Démarrage plus rapide avec Vite

### Pourquoi pas Redux / Zustand ?

- Hooks suffisent pour l'app
- Moins de boilerplate
- Apprentissage inutile

### Pourquoi shadcn/ui ?

- Composants headless + Tailwind = flexibilité
- Excellente accessibilité (Radix UI sous le capot)
- Thème Summer disponible
- Évite le CSS from scratch

---

## Notes d'Architecture

### Flux de Données

```
App
├── GeolocationHook (Permission + GPS)
│   └── AcademyMapper (GPS → Académie)
├── APIHook (Fetch Vacations)
│   └── Cache (localStorage 24h)
├── StatusHook (In vacation ou in school ?)
│   └── CountdownHook (Time remaining)
└── UI (Countdown + Selector)
```

### Composants Principaux

| Composant | Rôle | État |
|-----------|------|------|
| `App` | Racine, orchestration | Académie, vacations |
| `Header` | Logo + académie | Sélection académie |
| `Countdown` | Affichage principal | Time remaining |
| `AcademySelector` | Sélection manuelle | Selected academy |
| `LoadingSpinner` | État chargement | Loading states |
| `ErrorMessage` | Messages erreur | Error states |

---

## Performance Budget

| Métrique | Target | Status |
|----------|--------|--------|
| Lighthouse (mobile) | > 85 | À valider |
| Time to Interactive | < 2s | À optimiser |
| Bundle Size | < 200KB | À surveiller |
| First Paint | < 1s | À valider |

---

## Notes pour L'Équipe

1. **Pas de MVP** : L'app doit être complète et fonctionnelle
2. **Deadline Stricte** : 24 jan à 23:59
3. **Mobile-First** : Tests réguliers sur 375px
4. **Géolocalisation** : Voir PROJECT_SPEC pour formule Haversine
5. **Thème Summer** : Appliqué partout, pas de débats colorimétriques

---

## Astuces pour le Succès

1. **Respectez le Plan** : 19 tâches bien structurées
2. **Utilisez AIDD** : Les commandes sont faites pour ça
3. **Validez avant Commit** : `/qa` systématiquement
4. **Consultez les Specs** : PROJECT_SPEC.md est exhaustif
5. **Testez Mobile** : Dès que possible, sur un vrai téléphone si possible

---

## Ressources Indispensables

- **PROJECT_SPEC.md** : Spécifications complètes (1100+ lignes)
- **CLAUDE.md** : Guide technique détaillé
- **plan/project-plan.md** : Plan global avec 19 tâches
- **API Docs** : https://data.gouv.fr/dataservices/api-calendrier-scolaire

---

*Brainstorming généré le 19/01/2025 par AIDD Full | Mode Solo*

**⚠️ IMPORTANT** : Ce document est permanent et documente les décisions clés du projet. Ne pas supprimer.
