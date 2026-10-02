import type { AlgorithmDefinition } from '../../engine/types';

export function AlgorithmInfo({ algorithm }: { algorithm?: AlgorithmDefinition }) {
  return (
    <section className="panel" aria-label="Algorithm information">
      <p className="panel-label">About This Algorithm</p>
      {algorithm ? (
        <>
          <h2 className="algo-name">{algorithm.name}</h2>
          <p className="algo-desc">{algorithm.description}</p>
          <p className="panel-label">How It Works</p>
          <ol className="algo-steps">
            {algorithm.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </>
      ) : (
        <p className="step-explanation-text">Select an algorithm to see its explanation.</p>
      )}
    </section>
  );
}
