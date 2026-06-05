import type { VisualizationStep, VisualizationTimeline } from '../types/visualization';

/**
 * State handled by the visualization engine.
 *
 * The engine is intentionally independent from React and from any algorithm.
 * It only stores a timeline of precomputed visualization steps and the index
 * of the currently selected step.
 */
export type VisualizationEngineState = {
  readonly timeline: VisualizationTimeline;
  readonly currentIndex: number;
};

/**
 * Creates the initial engine state for a given timeline.
 *
 * The engine always starts at index 0. If the timeline is empty,
 * `getCurrentStep` will safely return `null`.
 */
export function createVisualizationEngine(
  timeline: VisualizationTimeline,
): VisualizationEngineState {
  return {
    timeline,
    currentIndex: 0,
  };
}

/**
 * Returns the currently selected visualization step.
 *
 * This function returns `null` when the timeline is empty or when the current
 * index does not point to an existing step.
 */
export function getCurrentStep(state: VisualizationEngineState): VisualizationStep | null {
  return state.timeline[state.currentIndex] ?? null;
}

/**
 * Indicates whether the engine can move to the next step.
 */
export function canGoNext(state: VisualizationEngineState): boolean {
  return state.currentIndex < state.timeline.length - 1;
}

/**
 * Indicates whether the engine can move to the previous step.
 */
export function canGoPrevious(state: VisualizationEngineState): boolean {
  return state.currentIndex > 0;
}

/**
 * Moves the engine to the next step when possible.
 *
 * The function is pure: it never mutates the received state. If the engine is
 * already on the last step, the same state is returned unchanged.
 */
export function next(state: VisualizationEngineState): VisualizationEngineState {
  if (!canGoNext(state)) {
    return state;
  }

  return {
    ...state,
    currentIndex: state.currentIndex + 1,
  };
}

/**
 * Moves the engine to the previous step when possible.
 *
 * The function is pure: it never mutates the received state. If the engine is
 * already on the first step, the same state is returned unchanged.
 */
export function previous(state: VisualizationEngineState): VisualizationEngineState {
  if (!canGoPrevious(state)) {
    return state;
  }

  return {
    ...state,
    currentIndex: state.currentIndex - 1,
  };
}

/**
 * Resets the engine to the first step of the timeline.
 *
 * The timeline itself is preserved.
 */
export function reset(state: VisualizationEngineState): VisualizationEngineState {
  return {
    ...state,
    currentIndex: 0,
  };
}
