import type { Visualizer } from '../../hooks/useVisualizer';

export function StatusBar({ viz }: { viz: Visualizer }) {
  const status = viz.totalSteps === 0 ? 'idle' : viz.playing ? 'playing' : viz.stepIndex >= viz.totalSteps - 1 ? 'complete' : viz.stepIndex === -1 ? 'ready' : 'paused';
  return (
    <footer className="status-bar">
      <span>
        alg <b>{viz.algorithmName || '—'}</b>
      </span>
      <span>
        step <b>{viz.stepIndex + 1} / {viz.totalSteps}</b>
      </span>
      <span>
        size <b>{viz.data.length}</b>
      </span>
      <span>
        speed <b>{viz.speed}×</b>
      </span>
      <span>
        status <b>{status}</b>
      </span>
      <span style={{ marginLeft: 'auto' }}>space play · ←/→ step · R reset · G new array</span>
    </footer>
  );
}
