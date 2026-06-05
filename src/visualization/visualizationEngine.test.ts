import { describe, expect, it } from 'vitest';

import type { VisualizationStep, VisualizationTimeline } from '../types/visualization';
import {
  canGoNext,
  canGoPrevious,
  createVisualizationEngine,
  getCurrentStep,
  next,
  previous,
  reset,
} from './visualizationEngine';

/**
 * Creates a minimal visualization step for engine tests.
 *
 * The engine does not care about the algorithm details, so these test steps
 * only need enough data to behave like real visualization steps.
 */
function createStep(id: string): VisualizationStep {
  return {
    id,
    kind: 'compare',
    label: `Step ${id}`,
    items: [],
    stats: {
      comparisons: 0,
      swaps: 0,
    },
  };
}

describe('visualizationEngine', () => {
  const timeline: VisualizationTimeline = [
    createStep('step-0'),
    createStep('step-1'),
    createStep('step-2'),
  ];

  it('creates an engine starting at the first step', () => {
    const state = createVisualizationEngine(timeline);

    expect(state.currentIndex).toBe(0);
    expect(getCurrentStep(state)).toEqual(timeline[0]);
  });

  it('moves to the next step when possible', () => {
    const initialState = createVisualizationEngine(timeline);
    const nextState = next(initialState);

    expect(nextState.currentIndex).toBe(1);
    expect(getCurrentStep(nextState)).toEqual(timeline[1]);
    expect(initialState.currentIndex).toBe(0);
  });

  it('does not move past the last step', () => {
    const state = next(next(createVisualizationEngine(timeline)));
    const finalState = next(state);

    expect(finalState.currentIndex).toBe(2);
    expect(getCurrentStep(finalState)).toEqual(timeline[2]);
  });

  it('moves to the previous step when possible', () => {
    const state = next(next(createVisualizationEngine(timeline)));
    const previousState = previous(state);

    expect(previousState.currentIndex).toBe(1);
    expect(getCurrentStep(previousState)).toEqual(timeline[1]);
  });

  it('does not move before the first step', () => {
    const state = createVisualizationEngine(timeline);
    const previousState = previous(state);

    expect(previousState.currentIndex).toBe(0);
    expect(getCurrentStep(previousState)).toEqual(timeline[0]);
  });

  it('resets the engine to the first step', () => {
    const state = next(next(createVisualizationEngine(timeline)));
    const resetState = reset(state);

    expect(resetState.currentIndex).toBe(0);
    expect(getCurrentStep(resetState)).toEqual(timeline[0]);
  });

  it('indicates whether next and previous moves are possible', () => {
    const firstState = createVisualizationEngine(timeline);
    const middleState = next(firstState);
    const lastState = next(middleState);

    expect(canGoPrevious(firstState)).toBe(false);
    expect(canGoNext(firstState)).toBe(true);

    expect(canGoPrevious(middleState)).toBe(true);
    expect(canGoNext(middleState)).toBe(true);

    expect(canGoPrevious(lastState)).toBe(true);
    expect(canGoNext(lastState)).toBe(false);
  });

  it('returns null when the timeline is empty', () => {
    const state = createVisualizationEngine([]);

    expect(getCurrentStep(state)).toBeNull();
    expect(canGoNext(state)).toBe(false);
    expect(canGoPrevious(state)).toBe(false);
  });
});
