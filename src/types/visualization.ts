/**
 * Visual state applied to a single item in an array visualization.
 *
 * These states are intentionally generic so they can be reused by several
 * sorting algorithms, not only Bubble Sort.
 */
export type ArrayItemVisualState = 'normal' | 'compare' | 'swap' | 'sorted';

/**
 * Logical category of a visualization step.
 *
 * The UI can use this value to display contextual labels, colors, or simple
 * animations without knowing the implementation details of the algorithm.
 */
export type VisualizationStepKind = 'initial' | 'compare' | 'swap' | 'mark-sorted' | 'complete';

/**
 * One visible item in an array-based visualization.
 *
 * The `id` should stay stable across steps so React can render lists reliably.
 * The `state` describes how this item should be displayed for the current step.
 */
export type ArrayVisualizationItem = {
  readonly id: string;
  readonly value: number;
  readonly state: ArrayItemVisualState;
};

/**
 * Cumulative statistics available at a given visualization step.
 *
 * For the MVP, we track only comparisons and swaps because they are enough to
 * explain Bubble Sort clearly.
 */
export type VisualizationStats = {
  readonly comparisons: number;
  readonly swaps: number;
};

/**
 * A complete snapshot of the visualization at a specific moment.
 *
 * Algorithms produce these steps. The visualization engine only navigates
 * through them; it does not need to know how they were generated.
 */
export type VisualizationStep = {
  readonly id: string;
  readonly kind: VisualizationStepKind;
  readonly label: string;
  readonly items: readonly ArrayVisualizationItem[];
  readonly stats: VisualizationStats;
};

/**
 * Ordered list of visualization steps produced by an algorithm.
 *
 * The engine moves through this timeline using an index, which enables controls
 * such as Next, Previous, Reset, Play, and Pause.
 */
export type VisualizationTimeline = readonly VisualizationStep[];
