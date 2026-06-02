import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>MVP Bubble Sort</p>
        <h1>Algorithm Visualizer</h1>
        <p>
          Application React pour visualiser des algorithmes et structures de données étape par
          étape.
        </p>
      </section>
    </main>
  );
}
