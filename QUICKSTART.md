# 🚀 QUICKSTART - VacancesEnVue

> Guide de démarrage rapide pour la développement du projet avec AIDD Full

---

## TL;DR - Les 3 Commandes Essentielles

```bash
/next-task    # Démarrer une tâche du plan
/qa           # Valider ton travail
/commit       # Sauvegarder
```

---

## Workflow Quotidien en 5 Étapes

### 1️⃣ Voir le Plan

```bash
/plan
```

**Résultat** : Affiche la liste de toutes les tâches avec leur statut et progression

---

### 2️⃣ Démarrer la Tâche Suivante

```bash
/next-task
```

**Résultat** :
- Marque la tâche en cours comme terminée (si applicable)
- Affiche les détails de la prochaine tâche
- Crée une liste de sous-tâches à faire

---

### 3️⃣ Coder la Solution

```
[Vous développez avec Claude...]
```

- Claude vous aide étape par étape
- Utilise les outils MCP (shadcn/ui, Context7)
- Crée les fichiers nécessaires
- Respecte les conventions du projet

---

### 4️⃣ Valider le Travail

```bash
/qa
```

**Résultat** :
- Checklist dynamique adaptée au type de tâche
- Valide tous les critères
- Verdict : ✅ PASS, ⚠️ PARTIAL, ou ❌ FAIL

---

### 5️⃣ Créer un Commit

```bash
/commit feat: ajouter géolocalisation
```

**Résultat** :
- Commit avec format Conventional Commits
- Version mise à jour si nécessaire
- CHANGELOG.md mis à jour

---

## Commandes par Situation

### "Je veux coder une feature"
```bash
/next-task
# ou directement
/task Ajouter un bouton de déconnexion
```

### "J'ai un bug à corriger"
```bash
/fix Le formulaire ne valide pas les emails
```

### "Je veux voir où j'en suis"
```bash
/plan           # Vue globale du projet
/current-task   # La tâche actuelle
```

### "Je veux faire une review"
```bash
/review
# ou
/deep-code-analysis [fichier]
```

### "Je dois optimiser le code"
```bash
/optimize
```

### "Je veux refactoriser"
```bash
/refactor
```

### "Je suis perdu"
```bash
/help           # Liste toutes les commandes
/explain-architecture  # Expliquer l'architecture du projet
```

---

## Types de Commit

| Préfixe | Quand l'utiliser | Exemple |
|---------|------------------|---------|
| `feat:` | Nouvelle fonctionnalité | `feat: ajouter géolocalisation` |
| `fix:` | Correction de bug | `fix: corriger responsive mobile` |
| `refactor:` | Refactoring sans changement fonctionnel | `refactor: extraire composant` |
| `style:` | CSS, formatage | `style: améliorer design Countdown` |
| `docs:` | Documentation | `docs: mettre à jour README` |
| `test:` | Ajout/modification de tests | `test: ajouter tests hook` |
| `chore:` | Maintenance, dépendances | `chore: update dependencies` |

---

## Mode de Travail : Solo

### Points Clés

1. **Vous développez seul** : Claude gère la coordination et vous aide
2. **Pas de délégation** : Pas d'agents supplémentaires
3. **Workflow direct** : Demande → Analyse → Code → Validation → Commit

### Outils MCP Obligatoires

**shadcn/ui** 🎨 :
- Utilisez EXCLUSIVEMENT les composants shadcn/ui via MCP
- ❌ Ne créez JAMAIS de composants UI from scratch
- ✅ Installez les composants via MCP au besoin

**Context7** 📚 :
- Consulter pour la documentation technique
- React hooks, Vite.js, TypeScript, Tailwind CSS v4

---

## Checklist d'Avant Commit

Avant chaque `/commit`, exécutez `/qa` pour vérifier :

- ✅ Le code compile/s'exécute sans erreur
- ✅ Pas de console.log/var_dump oubliés
- ✅ Code formaté selon les conventions (lint)
- ✅ Pas de secrets/credentials dans le code
- ✅ Tests passent (si applicable)
- ✅ Responsive validé (mobile-first)

---

## Arborescence du Projet

```
vacances-en-vue/
├── .claude/
│   ├── commands/          # Définitions des commandes AIDD
│   ├── plans/
│   │   └── project-plan.md  # Plan global du projet
│   └── agents/            # Agents spécialisés
├── src/
│   ├── components/        # Composants React
│   ├── services/          # Services API
│   ├── hooks/             # Custom hooks React
│   ├── utils/             # Fonctions utilitaires
│   ├── types/             # Interfaces TypeScript
│   ├── constants/         # Constantes (académies, etc.)
│   ├── App.tsx            # Composant racine
│   └── main.tsx           # Point d'entrée
├── CLAUDE.md              # Guide de développement
├── PROJECT_SPEC.md        # Spécifications complètes
├── package.json           # Dépendances
└── vite.config.ts         # Configuration Vite
```

---

## Conseils Pratiques

### 1. Soyez Spécifique dans vos Demandes

❌ Mauvais : `/task validation`
✅ Bon : `/task Créer le composant Countdown avec shadcn Card`

### 2. Utilisez `/qa` Avant `/commit`

Ca évite les oublis et améliore la qualité.

### 3. Un Commit = Une Feature/Fix

Pas de commits fourre-tout.

### 4. Respectez le Mobile-First

Tests sur 375px (mobile), 768px (tablet), 1024px+ (desktop)

### 5. Consultez les Specs

Quand vous avez une question : lisez `PROJECT_SPEC.md`

---

## Deadline & Livrables

⏰ **Deadline** : 24 janvier 2025, 23:59

📦 **Livrables** :
- ✅ Application complète et fonctionnelle
- ✅ Design mobile-first validé
- ✅ Thème Summer appliqué
- ✅ Pas d'erreurs console
- ✅ Lighthouse score > 85 sur mobile
- ✅ Conventional Commits utilisés

---

## Ressources

| Type | Lien |
|------|------|
| **Projet** | Cet repository |
| **Spécifications** | `PROJECT_SPEC.md` |
| **Plan** | `.claude/plans/project-plan.md` |
| **Guide Développement** | `CLAUDE.md` |
| **React** | https://react.dev/ |
| **Vite.js** | https://vitejs.dev/ |
| **Tailwind CSS v4** | https://tailwindcss.com/ |
| **shadcn/ui** | https://ui.shadcn.com/ |

---

## Support & Aide

- `/help` : Voir toutes les commandes
- `/explain-architecture` : Expliquer l'architecture
- `/deep-code-analysis` : Analyser le code en profondeur
- `PROJECT_SPEC.md` : Spécifications complètes
- `CLAUDE.md` : Guide technique détaillé

---

## Exemple de Workflow Complet

```bash
# 1. Voir le plan
/plan

# 2. Démarrer la tâche 1
/next-task
# → "Tâche 1 : Installation Tailwind CSS v4"

# 3. [Claude vous aide à installer Tailwind]

# 4. Valider le travail
/qa
# → "✅ PASS - Prêt à commit"

# 5. Créer le commit
/commit feat: installer Tailwind CSS v4

# 6. Passer à la tâche suivante
/next-task
# → "Tâche 2 : Installation shadcn/ui..."
```

---

## Bon Développement ! 🚀

Vous avez tout ce qu'il faut pour réussir le projet.

Commencez par `/next-task` et suivez les instructions !

---

*QUICKSTART généré par AIDD Full | 19/01/2025*
