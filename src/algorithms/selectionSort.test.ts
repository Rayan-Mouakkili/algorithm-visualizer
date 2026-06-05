import { describe, expect, it } from 'vitest';

import { createSelectionSortTimeline } from './selectionSort';

describe('createSelectionSortTimeline', () => {
  it('does not mutate the input array', () => {
    const input = [3, 1, 2];

    createSelectionSortTimeline(input);

    expect(input).toEqual([3, 1, 2]);
  });

  it('creates an initial step', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);

    expect(timeline[0]).toEqual({
      id: 'selection-sort-initial',
      kind: 'initial',
      label: 'Initial array.',
      items: [
        { id: 'array-item-0', value: 3, state: 'normal' },
        { id: 'array-item-1', value: 1, state: 'normal' },
        { id: 'array-item-2', value: 2, state: 'normal' },
      ],
      stats: {
        comparisons: 0,
        swaps: 0,
      },
    });
  });

  it('sorts the array in the final step', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);
    const finalStep = timeline.at(-1);

    expect(finalStep?.kind).toBe('complete');
    expect(finalStep?.items.map((item) => item.value)).toEqual([1, 2, 3]);
    expect(finalStep?.items.every((item) => item.state === 'sorted')).toBe(true);
  });

  it('creates comparison steps', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);
    const comparisonSteps = timeline.filter((step) => step.kind === 'compare');

    expect(comparisonSteps).toHaveLength(3);
    expect(comparisonSteps[0]?.items.map((item) => item.state)).toEqual([
      'compare',
      'compare',
      'normal',
    ]);
  });

  it('creates swap steps only when needed', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);
    const swapSteps = timeline.filter((step) => step.kind === 'swap');

    expect(swapSteps).toHaveLength(2);
    expect(swapSteps[0]?.items.map((item) => item.value)).toEqual([1, 3, 2]);
    expect(swapSteps[0]?.items.map((item) => item.state)).toEqual(['swap', 'swap', 'normal']);
  });

  it('marks the sorted prefix after each pass', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);
    const markSortedSteps = timeline.filter((step) => step.kind === 'mark-sorted');

    expect(markSortedSteps).toHaveLength(2);
    expect(markSortedSteps[0]?.items.map((item) => item.state)).toEqual([
      'sorted',
      'normal',
      'normal',
    ]);
    expect(markSortedSteps[1]?.items.map((item) => item.state)).toEqual([
      'sorted',
      'sorted',
      'normal',
    ]);
  });

  it('tracks comparisons and swaps', () => {
    const timeline = createSelectionSortTimeline([3, 1, 2]);
    const finalStep = timeline.at(-1);

    expect(finalStep?.stats).toEqual({
      comparisons: 3,
      swaps: 2,
    });
  });

  it('does not create swap steps for an already sorted array', () => {
    const timeline = createSelectionSortTimeline([1, 2, 3]);
    const finalStep = timeline.at(-1);

    expect(timeline.filter((step) => step.kind === 'swap')).toHaveLength(0);
    expect(finalStep?.items.map((item) => item.value)).toEqual([1, 2, 3]);
    expect(finalStep?.stats).toEqual({
      comparisons: 3,
      swaps: 0,
    });
  });

  it('handles duplicate values', () => {
    const timeline = createSelectionSortTimeline([2, 1, 2]);
    const finalStep = timeline.at(-1);

    expect(finalStep?.items.map((item) => item.value)).toEqual([1, 2, 2]);
    expect(finalStep?.items.every((item) => item.state === 'sorted')).toBe(true);
  });

  it('handles an empty array', () => {
    const timeline = createSelectionSortTimeline([]);
    const finalStep = timeline.at(-1);

    expect(timeline).toHaveLength(2);
    expect(finalStep?.kind).toBe('complete');
    expect(finalStep?.items).toEqual([]);
    expect(finalStep?.stats).toEqual({
      comparisons: 0,
      swaps: 0,
    });
  });

  it('handles an array with one item', () => {
    const timeline = createSelectionSortTimeline([42]);
    const finalStep = timeline.at(-1);

    expect(timeline).toHaveLength(2);
    expect(finalStep?.kind).toBe('complete');
    expect(finalStep?.items).toEqual([{ id: 'array-item-0', value: 42, state: 'sorted' }]);
    expect(finalStep?.stats).toEqual({
      comparisons: 0,
      swaps: 0,
    });
  });
});
