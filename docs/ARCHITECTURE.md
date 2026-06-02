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
