import { useEffect, useMemo, useRef } from 'react';
import { algorithmsByCategory } from './algorithms';
import { useVisualizer } from './hooks/useVisualizer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas';
import { ControlBar } from './components/controls/ControlBar';
import { StepExplanation } from './components/algorithm/StepExplanation';
import { PseudocodePanel } from './components/algorithm/PseudocodePanel';
import { ComplexityPanel } from './components/algorithm/ComplexityPanel';
import { AlgorithmInfo } from './components/algorithm/AlgorithmInfo';

export function App() {
  const viz = useVisualizer();
  const grouped = useMemo(() => algorithmsByCategory(), []);

  // Deep link support: /visualizer?algo=quick-sort
  const appliedInitialAlgo = useRef(false);
  useEffect(() => {
    if (appliedInitialAlgo.current) return;
    appliedInitialAlgo.current = true;
    const algo = new URLSearchParams(window.location.search).get('algo');
    if (algo) viz.selectAlgorithm(algo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyboardShortcuts({
    togglePlay: viz.togglePlay,
    next: viz.next,
    prev: viz.prev,
    reset: viz.reset,
    regenerate: viz.regenerate,
    enabled: true,
  });

  const algorithm = Array.from(grouped.values()).flat().find((a) => a.id === viz.algorithmId);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar
          grouped={grouped}
          activeId={viz.algorithmId}
          onSelect={viz.selectAlgorithm}
        />
        <main className="app-main">
          <VisualizationCanvas viz={viz} />
          <ControlBar viz={viz} />
          <StepExplanation step={viz.currentStep} target={viz.target} />
          <div className="panel-grid">
            <PseudocodePanel
              pseudocode={algorithm?.pseudocode ?? []}
              codeLine={viz.currentStep?.codeLine ?? -1}
            />
            <div className="panel-stack">
              <ComplexityPanel complexity={algorithm?.complexity} />
              <AlgorithmInfo algorithm={algorithm} />
            </div>
          </div>
        </main>
      </div>
      <StatusBar viz={viz} />
    </div>
  );
}
