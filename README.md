# Algorithm Visualizer

Application web interactive pour visualiser des algorithmes et structures de données étape par étape.

## Objectif

Le projet sert à apprendre l'algorithmique en construisant progressivement une application web propre, testable et maintenable.

Le MVP démarre avec Bubble Sort.

## MVP prévu

Le MVP devra permettre :

- d'afficher un tableau de nombres ;
- de visualiser Bubble Sort étape par étape ;
- d'utiliser les contrôles Play, Pause, Next, Previous et Reset ;
- d'afficher l'étape courante ;
- d'afficher des états visuels simples : normal, compare, swap, sorted ;
- d'afficher des statistiques simples : étape courante, total d'étapes, comparaisons, échanges ;
- de tester l'algorithme et le moteur de visualisation.

## Stack

- React
- Vite
- TypeScript strict
- CSS Modules
- Vitest
- ESLint
- Prettier
- npm

## Contraintes du MVP

Le MVP n'utilise pas :

- Redux ;
- Tailwind ;
- D3 ;
- Next.js ;
- backend ;
- base de données ;
- UI library.

## Architecture

Principe général :

algorithmes purs
-> étapes de visualisation
-> moteur de visualisation
-> état courant
-> interface utilisateur

Règles principales :

- les algorithmes ne dépendent pas de React ;
- les algorithmes ne manipulent pas le DOM ;
- les algorithmes produisent des étapes de visualisation ;
- le moteur consomme une timeline d'étapes ;
- l'interface affiche uniquement l'état courant ;
- les tests ciblent d'abord la logique pure.

Voir aussi : docs/ARCHITECTURE.md

## Scripts

Développement :

npm run dev

Build :

npm run build

Lint :

npm run lint

Formatage :

npm run format
npm run format:check

Tests :

npm run test
npm run test:watch
npm run coverage

## État actuel

Initialisation du dépôt et de l'outillage.

Déjà configuré :

- projet Vite React TypeScript ;
- structure minimale src/app, src/algorithms, src/visualization, src/types ;
- ESLint ;
- Prettier ;
- Vitest.

Pas encore implémenté :

- Bubble Sort ;
- moteur de visualisation ;
- interface du MVP ;
- tests métier.

## Roadmap

1. Initialisation du dépôt et de l'outillage.
2. Définition des types de visualisation.
3. Implémentation de Bubble Sort pur.
4. Implémentation du moteur de timeline.
5. Interface MVP avec contrôles.
6. Tests unitaires algorithme et moteur.
7. Documentation complémentaire.
8. Publication GitHub.
