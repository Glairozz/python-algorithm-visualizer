import type { Visualizer } from '../../hooks/useVisualizer';
import { emptyFrame } from '../../engine/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { EmptyState } from '../common/EmptyState';

export function VisualizationCanvas({ viz }: { viz: Visualizer }) {
  const frame = viz.currentStep?.frame ?? emptyFrame(viz.data);
  const pointers = viz.currentStep?.pointers ?? [];

  return (
    <section className="canvas" aria-label="Visualization">
      <div className="canvas-head">
        <span className="canvas-title">{viz.algorithmName}</span>
        <span className="canvas-meta">
          {viz.target !== undefined ? `target ${viz.target} · ` : ''}n = {viz.data.length}
        </span>
      </div>
      {viz.totalSteps === 0 && viz.data.length === 0 ? (
        <EmptyState title="Nothing to visualize" body="Generate an array to get started." />
      ) : (
        <ArrayVisualizer frame={frame} pointers={pointers} showLabels={viz.showLabels} showIndices />
      )}
    </section>
  );
}
