import { describe, expect, it } from 'vitest';

import { createBubbleSortTimeline } from './bubbleSort';

describe('createBubbleSortTimeline', () => {
  it('does not mutate the input array', () => {
    const input = [3, 2, 1];

    createBubbleSortTimeline(input);

    expect(input).toEqual([3, 2, 1]);
  });

  it('creates a timeline ending with a sorted array', () => {
    const timeline = createBubbleSortTimeline([3, 1, 2]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.items.map((item) => item.value)).toEqual([1, 2, 3]);
    expect(lastStep?.items.every((item) => item.state === 'sorted')).toBe(true);
  });

  it('counts comparisons and swaps', () => {
    const timeline = createBubbleSortTimeline([3, 2, 1]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.stats.comparisons).toBe(3);
    expect(lastStep?.stats.swaps).toBe(3);
  });

  it('handles an already sorted array', () => {
    const timeline = createBubbleSortTimeline([1, 2, 3]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.items.map((item) => item.value)).toEqual([1, 2, 3]);
    expect(lastStep?.stats.comparisons).toBe(3);
    expect(lastStep?.stats.swaps).toBe(0);
  });

  it('handles duplicate values', () => {
    const timeline = createBubbleSortTimeline([2, 1, 2]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.items.map((item) => item.value)).toEqual([1, 2, 2]);
  });

  it('handles an empty array', () => {
    const timeline = createBubbleSortTimeline([]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.items).toEqual([]);
    expect(lastStep?.stats.comparisons).toBe(0);
    expect(lastStep?.stats.swaps).toBe(0);
  });

  it('handles a single-item array', () => {
    const timeline = createBubbleSortTimeline([42]);

    const lastStep = timeline.at(-1);

    expect(lastStep?.items.map((item) => item.value)).toEqual([42]);
    expect(lastStep?.items[0]?.state).toBe('sorted');
  });

  it('creates compare steps', () => {
    const timeline = createBubbleSortTimeline([2, 1]);

    expect(timeline.some((step) => step.items.some((item) => item.state === 'compare'))).toBe(true);
  });

  it('creates swap steps when needed', () => {
    const timeline = createBubbleSortTimeline([2, 1]);

    expect(timeline.some((step) => step.items.some((item) => item.state === 'swap'))).toBe(true);
  });
});
