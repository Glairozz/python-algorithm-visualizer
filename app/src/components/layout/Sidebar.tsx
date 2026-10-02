import type { AlgorithmDefinition } from '../../engine/types';

interface SidebarProps {
  grouped: Map<string, AlgorithmDefinition[]>;
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ grouped, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Algorithm categories">
      {[...grouped.entries()].map(([category, algos]) => (
        <div className="sidebar-category" key={category}>
          <h2>{category}</h2>
          {algos.map((algo) => (
            <button
              key={algo.id}
              className={`algo-item${algo.id === activeId ? ' active' : ''}`}
              onClick={() => onSelect(algo.id)}
              aria-current={algo.id === activeId ? 'true' : undefined}
            >
              {algo.name}
              <span className="algo-tag">{algo.tagline}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
