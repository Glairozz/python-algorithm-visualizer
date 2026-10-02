interface PseudocodePanelProps {
  pseudocode: string[];
  codeLine: number;
}

export function PseudocodePanel({ pseudocode, codeLine }: PseudocodePanelProps) {
  return (
    <section className="panel" aria-label="Pseudocode">
      <p className="panel-label">Pseudocode</p>
      <pre className="pseudocode">
        {pseudocode.map((line, i) => (
          <code key={i} className={`code-line${i === codeLine ? ' active' : ''}`}>
            <span className="ln">{String(i + 1).padStart(2, '0')}</span>
            <span>{line || ' '}</span>
          </code>
        ))}
      </pre>
    </section>
  );
}
