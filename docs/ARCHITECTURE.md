# Architecture

Algorithm Visualizer suit une séparation stricte entre la logique algorithmique, le moteur de visualisation et l'interface utilisateur.

## Principe général

algorithmes purs
-> étapes de visualisation
-> moteur de visualisation
-> état courant
-> interface utilisateur

## Règles

- Les algorithmes ne dépendent pas de React.
- Les algorithmes ne manipulent pas le DOM.
- Les algorithmes produisent des étapes de visualisation.
- Le moteur consomme une timeline d'étapes.
- L'interface affiche uniquement l'état courant.
- Les tests couvrent d'abord la logique pure.

## Structure initiale

src/
app/
algorithms/
visualization/
types/

docs/
ARCHITECTURE.md

## MVP initial

Le MVP démarre avec Bubble Sort.

Les extensions comme Selection Sort, les structures de données ou les tests end-to-end viendront plus tard.

## Moteur de visualisation

Le moteur de visualisation est indépendant de React et des algorithmes.

Son rôle est uniquement de naviguer dans une timeline d’étapes déjà produites par un algorithme.

Flux prévu :

algorithme pur
→ `VisualizationTimeline`
→ moteur de visualisation
→ étape courante
→ interface utilisateur

Le moteur ne trie pas les données, ne manipule pas le DOM et ne connaît pas Bubble Sort.

Il expose des fonctions pures :

- `createVisualizationEngine` : crée l’état initial du moteur ;
- `getCurrentStep` : retourne l’étape courante ;
- `next` : avance d’une étape si possible ;
- `previous` : recule d’une étape si possible ;
- `reset` : revient à la première étape ;
- `canGoNext` : indique si l’avancement est possible ;
- `canGoPrevious` : indique si le retour arrière est possible.

L’état du moteur est représenté par le type `VisualizationEngineState`.

Ce type contient :

- `timeline` : la liste immuable des étapes de visualisation ;
- `currentIndex` : l’index de l’étape actuellement sélectionnée.

Cette approche permet de tester le moteur sans React et de connecter plus tard l’interface utilisateur sans mélanger UI, algorithmes et logique de navigation.

Cas limite pris en charge :

- si la timeline est vide, `getCurrentStep` retourne `null`.
