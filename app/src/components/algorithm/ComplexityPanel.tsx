import type { Complexity } from '../../engine/types';

export function ComplexityPanel({ complexity }: { complexity?: Complexity }) {
  return (
    <section className="panel" aria-label="Complexity">
      <p className="panel-label">Complexity</p>
      {complexity ? (
        <table className="complexity-table">
          <tbody>
            <tr><td>Time · Best</td><td>{complexity.best}</td></tr>
            <tr><td>Time · Average</td><td>{complexity.average}</td></tr>
            <tr><td>Time · Worst</td><td>{complexity.worst}</td></tr>
            <tr><td>Space</td><td>{complexity.space}</td></tr>
          </tbody>
        </table>
      ) : (
        <p className="step-explanation-text">—</p>
      )}
    </section>
  );
}
