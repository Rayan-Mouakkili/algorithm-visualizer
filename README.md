# Algorithm Visualizer

Application web interactive pour visualiser des algorithmes et structures de données étape par étape.

## Objectif

Algorithm Visualizer sert à apprendre l'algorithmique en construisant progressivement une application web propre, testable, maintenable et publiable.

L'application permet actuellement de visualiser plusieurs algorithmes de tri avec la même architecture de visualisation.

## Fonctionnalités actuelles

L'application permet actuellement :

- d'afficher un tableau de nombres ;
- de choisir entre Bubble Sort et Selection Sort ;
- de visualiser l'algorithme sélectionné étape par étape ;
- d'utiliser les contrôles Previous, Next, Reset, Play et Pause ;
- d'afficher l'étape courante ;
- d'afficher les états visuels suivants :
  - normal ;
  - compare ;
  - swap ;
  - sorted ;
- d'afficher des statistiques simples :
  - étape courante ;
  - total d'étapes ;
  - comparaisons ;
  - échanges ;
- de tester les algorithmes purs ;
- de tester le moteur pur de visualisation.

## Stack

- React
- Vite
- TypeScript strict
- CSS Modules
- HTML/CSS/SVG natifs
- Vitest
- ESLint
- Prettier
- npm
- GitHub Actions

## Contraintes du projet

Le projet n'utilise pas :

- Redux ;
- Tailwind ;
- D3 ;
- Next.js ;
- backend ;
- base de données ;
- UI library.

## Architecture

Principe général :

```txt
algorithmes purs
-> étapes de visualisation
-> moteur de visualisation
-> état courant
-> interface utilisateur
```

Règles principales :

- les algorithmes ne dépendent pas de React ;
- les algorithmes ne manipulent pas le DOM ;
- les algorithmes produisent une timeline d'étapes de visualisation ;
- le moteur consomme une timeline d'étapes ;
- le moteur navigue dans la timeline sans connaître l'algorithme utilisé ;
- l'interface React affiche uniquement l'état courant ;
- les tests ciblent d'abord la logique pure.

Voir aussi : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Structure principale

```txt
src/
  app/
    App.tsx
    App.module.css
  algorithms/
    bubbleSort.ts
    bubbleSort.test.ts
    selectionSort.ts
    selectionSort.test.ts
  types/
    visualization.ts
  visualization/
    visualizationEngine.ts
    visualizationEngine.test.ts

docs/
  ARCHITECTURE.md
```

## Scripts

Lancer l'application en développement :

```bash
npm run dev
```

Vérifier le formatage :

```bash
npm run format:check
```

Formater le code :

```bash
npm run format
```

Lancer ESLint :

```bash
npm run lint
```

Lancer les tests :

```bash
npm run test
```

Lancer les tests en mode watch :

```bash
npm run test:watch
```

Générer la couverture de tests :

```bash
npm run coverage
```

Créer un build de production :

```bash
npm run build
```

## Vérification avant publication

Avant de publier ou de créer un commit important, exécuter :

```bash
npm run format:check
npm run lint
npm run test
npm run build
```

État actuel vérifié :

- formatage OK ;
- lint OK ;
- 28 tests passent ;
- build OK.

## État actuel

L'application visualise actuellement deux algorithmes de tri :

- Bubble Sort ;
- Selection Sort.

Déjà implémenté :

- types centraux de visualisation ;
- moteur pur de navigation dans une timeline ;
- génération pure de la timeline Bubble Sort ;
- génération pure de la timeline Selection Sort ;
- interface React avec sélecteur d'algorithme ;
- contrôles Previous, Next, Reset, Play et Pause ;
- affichage des états visuels ;
- affichage des statistiques ;
- tests unitaires du moteur ;
- tests unitaires de Bubble Sort ;
- tests unitaires de Selection Sort ;
- documentation d'architecture ;
- GitHub Actions pour vérifier formatage, lint, tests et build.

## Roadmap

Étapes terminées :

1. Initialisation du dépôt et de l'outillage.
2. Définition des types de visualisation.
3. Implémentation de Bubble Sort pur.
4. Implémentation du moteur de timeline.
5. Interface MVP avec contrôles.
6. Tests unitaires algorithme et moteur.
7. Documentation initiale.
8. Publication du dépôt sur GitHub.
9. Ajout de GitHub Actions.
10. Ajout de Selection Sort.
11. Ajout d'un sélecteur d'algorithme dans l'interface.

Prochaines étapes possibles :

1. Améliorer la saisie du tableau d'entrée.
2. Extraire des composants React réutilisables.
3. Ajouter quelques tests UI avec React Testing Library.
4. Ajouter un autre algorithme de tri simple, par exemple Insertion Sort.
5. Ajouter Playwright plus tard pour des scénarios end-to-end simples.
6. Préparer un déploiement statique.
