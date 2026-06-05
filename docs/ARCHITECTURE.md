# Architecture

Algorithm Visualizer suit une séparation stricte entre la logique algorithmique, le moteur de visualisation et l'interface utilisateur.

L'objectif est de garder le projet simple, testable et extensible sans mélanger les responsabilités.

## Principe général

```txt
algorithmes purs
-> étapes de visualisation
-> moteur de visualisation
-> état courant
-> interface utilisateur
```

## Règles principales

- Les algorithmes ne dépendent pas de React.
- Les algorithmes ne manipulent pas le DOM.
- Les algorithmes produisent une timeline d'étapes de visualisation.
- Le moteur consomme une timeline d'étapes déjà produite.
- Le moteur ne connaît pas l'algorithme utilisé.
- L'interface React affiche uniquement l'état courant.
- Les tests couvrent d'abord la logique pure.

## Structure actuelle

```txt
src/
  app/
    App.tsx
    App.module.css
  algorithms/
    bubbleSort.ts
    bubbleSort.test.ts
  types/
    visualization.ts
  visualization/
    visualizationEngine.ts
    visualizationEngine.test.ts

docs/
  ARCHITECTURE.md
```

## Types de visualisation

Les types centraux sont définis dans `src/types/visualization.ts`.

Ils décrivent le contrat entre les algorithmes, le moteur et l'interface.

Le type principal est `VisualizationTimeline`.

Une timeline est une liste ordonnée d'étapes. Chaque étape représente un état affichable de l'algorithme à un instant donné.

Les étapes contiennent notamment :

- les items à afficher ;
- leur état visuel ;
- les statistiques courantes ;
- une description textuelle de l'action ;
- le type d'action représentée.

Les états visuels actuellement utilisés sont :

- `normal` ;
- `compare` ;
- `swap` ;
- `sorted`.

Ces états sont indépendants de React. React les utilise seulement pour choisir un style d'affichage.

## Algorithmes

Les algorithmes sont placés dans `src/algorithms/`.

Le MVP contient actuellement `bubbleSort.ts`.

Son rôle est de générer une `VisualizationTimeline` à partir d'un tableau de nombres.

L'algorithme :

- ne dépend pas de React ;
- ne manipule pas le DOM ;
- ne lance pas d'animation ;
- ne connaît pas les boutons de l'interface ;
- produit uniquement des étapes de visualisation.

Cette séparation permet de tester Bubble Sort comme une fonction pure.

## Moteur de visualisation

Le moteur est défini dans `src/visualization/visualizationEngine.ts`.

Il est indépendant de React et des algorithmes.

Son rôle est uniquement de naviguer dans une timeline d'étapes déjà produite.

Flux actuel :

```txt
bubbleSort
-> VisualizationTimeline
-> visualizationEngine
-> currentStep
-> App.tsx
```

Le moteur ne trie pas les données, ne manipule pas le DOM et ne connaît pas Bubble Sort.

Il expose des fonctions pures :

- `createVisualizationEngine` : crée l'état initial du moteur ;
- `getCurrentStep` : retourne l'étape courante ;
- `next` : avance d'une étape si possible ;
- `previous` : recule d'une étape si possible ;
- `reset` : revient à la première étape ;
- `canGoNext` : indique si l'avancement est possible ;
- `canGoPrevious` : indique si le retour arrière est possible.

L'état du moteur est représenté par le type `VisualizationEngineState`.

Ce type contient :

- `timeline` : la liste des étapes de visualisation ;
- `currentIndex` : l'index de l'étape actuellement sélectionnée.

Cas limite pris en charge :

- si la timeline est vide, `getCurrentStep` retourne `null`.

## Interface utilisateur

L'interface du MVP est dans `src/app/App.tsx`.

Son rôle est d'orchestrer l'affichage :

- créer la timeline Bubble Sort ;
- créer l'état du moteur ;
- afficher l'étape courante ;
- afficher les barres du tableau ;
- appliquer les styles visuels ;
- afficher les statistiques ;
- gérer les contrôles Previous, Next, Reset, Play et Pause.

Le mode Play/Pause est volontairement géré côté React.

Le moteur ne contient pas de notion de temps, d'intervalle ou d'animation automatique. Il reste donc pur et testable.

## Styles

Les styles du MVP sont dans `src/app/App.module.css`.

Les classes CSS traduisent les états visuels produits par la timeline :

- état normal ;
- comparaison ;
- échange ;
- élément trié.

Le CSS ne contient pas de logique algorithmique.

## Tests

Les tests actuels ciblent d'abord les fonctions pures.

Tests existants :

- `src/visualization/visualizationEngine.test.ts` ;
- `src/algorithms/bubbleSort.test.ts`.

La logique testée inclut notamment :

- la création du moteur ;
- la navigation vers l'étape suivante ;
- la navigation vers l'étape précédente ;
- le reset ;
- les limites de navigation ;
- le comportement avec une timeline vide ;
- la génération des étapes Bubble Sort ;
- les comparaisons ;
- les échanges ;
- l'état final trié.

Les tests UI avec React Testing Library pourront être ajoutés plus tard, quand l'interface sera plus stable.

Les tests end-to-end avec Playwright viendront également plus tard.

## Extension future

Pour ajouter un nouvel algorithme, par exemple Selection Sort, il faudra respecter le même contrat :

```txt
nouvel algorithme pur
-> VisualizationTimeline
-> moteur existant
-> interface utilisateur
```

Le moteur ne doit pas être modifié pour chaque nouvel algorithme.

Une extension correcte consiste à :

1. créer une fonction pure dans `src/algorithms/` ;
2. générer une `VisualizationTimeline` compatible ;
3. ajouter les tests unitaires de l'algorithme ;
4. connecter la timeline à l'interface ;
5. éviter toute dépendance entre l'algorithme et React.

Cette architecture permet d'ajouter progressivement d'autres algorithmes sans réécrire le moteur de visualisation.
