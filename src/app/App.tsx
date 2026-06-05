import { useEffect, useMemo, useState } from 'react';

import { createBubbleSortTimeline } from '../algorithms/bubbleSort';
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

/**
 * Main application component for the Bubble Sort MVP.
 *
 * React only displays the current visualization step. The sorting logic remains
 * isolated in `algorithms/`, and timeline navigation remains isolated in
 * `visualization/`.
 */
export function App() {
  const timeline = useMemo(() => createBubbleSortTimeline(INITIAL_VALUES), []);
  const [engineState, setEngineState] = useState(() => createVisualizationEngine(timeline));
  const [isPlaying, setIsPlaying] = useState(false);

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
  }, [canContinuePlaying]);

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
        <h1>Bubble Sort</h1>
        <p className={styles.description}>
          Visualize how Bubble Sort compares adjacent values, swaps them when needed, and
          progressively marks the array as sorted.
        </p>
      </section>

      <section className={styles.visualizationCard} aria-label="Bubble Sort visualization">
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
