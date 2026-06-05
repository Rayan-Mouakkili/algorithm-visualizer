import { useEffect, useState, type ChangeEvent } from 'react';

import { createBubbleSortTimeline } from '../algorithms/bubbleSort';
import { createSelectionSortTimeline } from '../algorithms/selectionSort';
import type { VisualizationTimeline } from '../types/visualization';
import {
  canGoNext,
  canGoPrevious,
  createVisualizationEngine,
  getCurrentStep,
  next,
  previous,
  reset,
} from '../visualization/visualizationEngine';
import styles from './App.module.css';

const INITIAL_VALUES = [5, 3, 8, 4, 2];
const PLAY_INTERVAL_MS = 700;

const ALGORITHM_IDS = ['bubble-sort', 'selection-sort'] as const;

type AlgorithmId = (typeof ALGORITHM_IDS)[number];

type AlgorithmConfig = {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly createTimeline: (input: readonly number[]) => VisualizationTimeline;
};

const ALGORITHM_CONFIG: Record<AlgorithmId, AlgorithmConfig> = {
  'bubble-sort': {
    name: 'Bubble Sort',
    title: 'Bubble Sort',
    description:
      'Visualize how Bubble Sort compares adjacent values, swaps them when needed, and progressively marks the array as sorted.',
    createTimeline: createBubbleSortTimeline,
  },
  'selection-sort': {
    name: 'Selection Sort',
    title: 'Selection Sort',
    description:
      'Visualize how Selection Sort repeatedly finds the smallest value in the unsorted part and places it in its final position.',
    createTimeline: createSelectionSortTimeline,
  },
};

/**
 * Main application component for the sorting visualizer.
 *
 * React only displays the current visualization step. Sorting algorithms remain
 * isolated in `algorithms/`, and timeline navigation remains isolated in
 * `visualization/`.
 */
export function App() {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<AlgorithmId>('bubble-sort');
  const [engineState, setEngineState] = useState(() =>
    createVisualizationEngine(ALGORITHM_CONFIG['bubble-sort'].createTimeline(INITIAL_VALUES)),
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedAlgorithm = ALGORITHM_CONFIG[selectedAlgorithmId];
  const currentStep = getCurrentStep(engineState);
  const canContinuePlaying = isPlaying && canGoNext(engineState);

  useEffect(() => {
    if (!canContinuePlaying) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEngineState((currentState) => next(currentState));
    }, PLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canContinuePlaying, engineState.currentIndex]);

  function handleAlgorithmChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextAlgorithmId = event.target.value;

    if (!isAlgorithmId(nextAlgorithmId)) {
      return;
    }

    const nextTimeline = ALGORITHM_CONFIG[nextAlgorithmId].createTimeline(INITIAL_VALUES);

    setIsPlaying(false);
    setSelectedAlgorithmId(nextAlgorithmId);
    setEngineState(createVisualizationEngine(nextTimeline));
  }

  function handlePrevious() {
    setIsPlaying(false);
    setEngineState((currentState) => previous(currentState));
  }

  function handleNext() {
    setIsPlaying(false);
    setEngineState((currentState) => next(currentState));
  }

  function handleReset() {
    setIsPlaying(false);
    setEngineState((currentState) => reset(currentState));
  }

  function handlePlayPause() {
    setIsPlaying((currentValue) => !currentValue);
  }

  if (currentStep === null) {
    return (
      <main className={styles.app}>
        <p>No visualization step available.</p>
      </main>
    );
  }

  return (
    <main className={styles.app}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Algorithm Visualizer</p>
        <h1>{selectedAlgorithm.title}</h1>
        <p className={styles.description}>{selectedAlgorithm.description}</p>

        <label className={styles.algorithmSelector}>
          Algorithm
          <select value={selectedAlgorithmId} onChange={handleAlgorithmChange}>
            {ALGORITHM_IDS.map((algorithmId) => (
              <option key={algorithmId} value={algorithmId}>
                {ALGORITHM_CONFIG[algorithmId].name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section
        className={styles.visualizationCard}
        aria-label={`${selectedAlgorithm.name} visualization`}
      >
        <div className={styles.array}>
          {currentStep.items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div
                className={`${styles.bar} ${styles[item.state]}`}
                style={{ height: `${item.value * 28}px` }}
                title={`Value ${item.value}`}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <p className={styles.stepLabel}>{currentStep.label}</p>

        <div className={styles.controls} aria-label="Visualization controls">
          <button type="button" onClick={handlePrevious} disabled={!canGoPrevious(engineState)}>
            Previous
          </button>
          <button type="button" onClick={handlePlayPause} disabled={!canGoNext(engineState)}>
            {canContinuePlaying ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={handleNext} disabled={!canGoNext(engineState)}>
            Next
          </button>
          <button type="button" onClick={handleReset} disabled={!canGoPrevious(engineState)}>
            Reset
          </button>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Step</dt>
            <dd>
              {engineState.currentIndex + 1} / {engineState.timeline.length}
            </dd>
          </div>
          <div>
            <dt>Comparisons</dt>
            <dd>{currentStep.stats.comparisons}</dd>
          </div>
          <div>
            <dt>Swaps</dt>
            <dd>{currentStep.stats.swaps}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

function isAlgorithmId(value: string): value is AlgorithmId {
  return ALGORITHM_IDS.some((algorithmId) => algorithmId === value);
}
