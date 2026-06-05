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
 * Creates a visualization timeline for Bubble Sort.
 *
 * The function is pure:
 * - it does not mutate the input array;
 * - it does not depend on React or the DOM;
 * - it produces visualization steps compatible with the visualization engine.
 */
export function createBubbleSortTimeline(input: readonly number[]): VisualizationTimeline {
  const items: SortableItem[] = input.map((value, index) => ({
    id: `array-item-${index}`,
    value,
  }));

  const timeline: VisualizationStep[] = [];

  let comparisons = 0;
  let swaps = 0;

  timeline.push(
    createStep({
      id: 'bubble-sort-initial',
      kind: 'initial',
      label: 'Initial array.',
      items,
      activeIndices: [],
      activeState: 'normal',
      sortedFromIndex: items.length,
      comparisons,
      swaps,
    }),
  );

  if (items.length <= 1) {
    timeline.push(
      createStep({
        id: 'bubble-sort-complete',
        kind: 'complete',
        label: 'Array is already sorted.',
        items,
        activeIndices: [],
        activeState: 'sorted',
        sortedFromIndex: 0,
        comparisons,
        swaps,
      }),
    );

    return timeline;
  }

  for (let pass = 0; pass < items.length - 1; pass += 1) {
    const lastUnsortedIndex = items.length - pass - 1;

    for (let index = 0; index < lastUnsortedIndex; index += 1) {
      const nextIndex = index + 1;
      const leftValue = items[index].value;
      const rightValue = items[nextIndex].value;

      comparisons += 1;

      timeline.push(
        createStep({
          id: `bubble-sort-compare-${pass}-${index}`,
          kind: 'compare',
          label: `Compare ${leftValue} and ${rightValue}.`,
          items,
          activeIndices: [index, nextIndex],
          activeState: 'compare',
          sortedFromIndex: lastUnsortedIndex + 1,
          comparisons,
          swaps,
        }),
      );

      if (leftValue > rightValue) {
        [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
        swaps += 1;

        timeline.push(
          createStep({
            id: `bubble-sort-swap-${pass}-${index}`,
            kind: 'swap',
            label: `Swap ${leftValue} and ${rightValue}.`,
            items,
            activeIndices: [index, nextIndex],
            activeState: 'swap',
            sortedFromIndex: lastUnsortedIndex + 1,
            comparisons,
            swaps,
          }),
        );
      }
    }

    timeline.push(
      createStep({
        id: `bubble-sort-mark-sorted-${pass}`,
        kind: 'mark-sorted',
        label: `${items[lastUnsortedIndex].value} is now in its final position.`,
        items,
        activeIndices: [lastUnsortedIndex],
        activeState: 'sorted',
        sortedFromIndex: lastUnsortedIndex,
        comparisons,
        swaps,
      }),
    );
  }

  timeline.push(
    createStep({
      id: 'bubble-sort-complete',
      kind: 'complete',
      label: 'Array is fully sorted.',
      items,
      activeIndices: [],
      activeState: 'sorted',
      sortedFromIndex: 0,
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
  readonly sortedFromIndex: number;
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
  sortedFromIndex,
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
        sortedFromIndex,
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
  readonly sortedFromIndex: number;
};

function getItemState({
  index,
  activeIndices,
  activeState,
  sortedFromIndex,
}: GetItemStateParams): ArrayItemVisualState {
  if (index >= sortedFromIndex) {
    return 'sorted';
  }

  if (activeIndices.includes(index)) {
    return activeState;
  }

  return 'normal';
}
