import type {
  ArrayItemVisualState,
  VisualizationStep,
  VisualizationStepKind,
  VisualizationTimeline,
} from '../types/visualization';

type SortableItem = {
  readonly id: string;
  readonly value: number;
};

/**
 * Creates a visualization timeline for Selection Sort.
 *
 * The function is pure:
 * - it does not mutate the input array;
 * - it does not depend on React or the DOM;
 * - it produces visualization steps compatible with the visualization engine.
 *
 * Selection Sort works by repeatedly selecting the smallest value from the
 * unsorted part of the array and placing it at the beginning of that part.
 */
export function createSelectionSortTimeline(input: readonly number[]): VisualizationTimeline {
  const items: SortableItem[] = input.map((value, index) => ({
    id: `array-item-${index}`,
    value,
  }));

  const timeline: VisualizationStep[] = [];

  let comparisons = 0;
  let swaps = 0;

  timeline.push(
    createStep({
      id: 'selection-sort-initial',
      kind: 'initial',
      label: 'Initial array.',
      items,
      activeIndices: [],
      activeState: 'normal',
      sortedBeforeIndex: 0,
      comparisons,
      swaps,
    }),
  );

  if (items.length <= 1) {
    timeline.push(
      createStep({
        id: 'selection-sort-complete',
        kind: 'complete',
        label: 'Array is already sorted.',
        items,
        activeIndices: [],
        activeState: 'sorted',
        sortedBeforeIndex: items.length,
        comparisons,
        swaps,
      }),
    );

    return timeline;
  }

  for (let boundaryIndex = 0; boundaryIndex < items.length - 1; boundaryIndex += 1) {
    let minIndex = boundaryIndex;

    for (
      let candidateIndex = boundaryIndex + 1;
      candidateIndex < items.length;
      candidateIndex += 1
    ) {
      const minValue = items[minIndex].value;
      const candidateValue = items[candidateIndex].value;

      comparisons += 1;

      timeline.push(
        createStep({
          id: `selection-sort-compare-${boundaryIndex}-${candidateIndex}`,
          kind: 'compare',
          label: `Compare current minimum ${minValue} with ${candidateValue}.`,
          items,
          activeIndices: [minIndex, candidateIndex],
          activeState: 'compare',
          sortedBeforeIndex: boundaryIndex,
          comparisons,
          swaps,
        }),
      );

      if (candidateValue < minValue) {
        minIndex = candidateIndex;
      }
    }

    if (minIndex !== boundaryIndex) {
      const boundaryValue = items[boundaryIndex].value;
      const minValue = items[minIndex].value;

      [items[boundaryIndex], items[minIndex]] = [items[minIndex], items[boundaryIndex]];
      swaps += 1;

      timeline.push(
        createStep({
          id: `selection-sort-swap-${boundaryIndex}-${minIndex}`,
          kind: 'swap',
          label: `Swap ${boundaryValue} and ${minValue}.`,
          items,
          activeIndices: [boundaryIndex, minIndex],
          activeState: 'swap',
          sortedBeforeIndex: boundaryIndex,
          comparisons,
          swaps,
        }),
      );
    }

    timeline.push(
      createStep({
        id: `selection-sort-mark-sorted-${boundaryIndex}`,
        kind: 'mark-sorted',
        label: `${items[boundaryIndex].value} is now in its final position.`,
        items,
        activeIndices: [boundaryIndex],
        activeState: 'sorted',
        sortedBeforeIndex: boundaryIndex + 1,
        comparisons,
        swaps,
      }),
    );
  }

  timeline.push(
    createStep({
      id: 'selection-sort-complete',
      kind: 'complete',
      label: 'Array is fully sorted.',
      items,
      activeIndices: [],
      activeState: 'sorted',
      sortedBeforeIndex: items.length,
      comparisons,
      swaps,
    }),
  );

  return timeline;
}

type CreateStepParams = {
  readonly id: string;
  readonly kind: VisualizationStepKind;
  readonly label: string;
  readonly items: readonly SortableItem[];
  readonly activeIndices: readonly number[];
  readonly activeState: ArrayItemVisualState;
  readonly sortedBeforeIndex: number;
  readonly comparisons: number;
  readonly swaps: number;
};

function createStep({
  id,
  kind,
  label,
  items,
  activeIndices,
  activeState,
  sortedBeforeIndex,
  comparisons,
  swaps,
}: CreateStepParams): VisualizationStep {
  return {
    id,
    kind,
    label,
    items: items.map((item, index) => ({
      id: item.id,
      value: item.value,
      state: getItemState({
        index,
        activeIndices,
        activeState,
        sortedBeforeIndex,
      }),
    })),
    stats: {
      comparisons,
      swaps,
    },
  };
}

type GetItemStateParams = {
  readonly index: number;
  readonly activeIndices: readonly number[];
  readonly activeState: ArrayItemVisualState;
  readonly sortedBeforeIndex: number;
};

function getItemState({
  index,
  activeIndices,
  activeState,
  sortedBeforeIndex,
}: GetItemStateParams): ArrayItemVisualState {
  if (index < sortedBeforeIndex) {
    return 'sorted';
  }

  if (activeIndices.includes(index)) {
    return activeState;
  }

  return 'normal';
}
