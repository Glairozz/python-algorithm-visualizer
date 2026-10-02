import type { Step } from '../../engine/types';

export function StepExplanation({ step, target }: { step: Step | null; target?: number }) {
  return (
    <section className="panel" aria-label="Current operation" aria-live="polite">
      <p className="panel-label">Current Operation</p>
      {step ? (
        <>
          <span className="op-chip">{step.operation}</span>
          <p className="step-explanation-text">{step.explanation}</p>
        </>
      ) : (
        <>
          <span className="op-chip idle">READY</span>
          <p className="step-explanation-text">
            Press play or step forward to begin.
            {target !== undefined ? ` The target value is ${target}.` : ''}
          </p>
        </>
      )}
    </section>
  );
}
