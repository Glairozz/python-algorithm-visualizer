import { useRef } from 'react';
import type { Visualizer } from '../../hooks/useVisualizer';
import { MAX_SIZE, MIN_SIZE } from '../../hooks/useVisualizer';
import { SPEEDS } from '../../engine/playback';

export function ControlBar({ viz }: { viz: Visualizer }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || viz.totalSteps === 0) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    viz.seek(Math.round(frac * viz.totalSteps) - 1);
  };

  const handleSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    viz.setSize(Number(e.target.value));
  };

  return (
    <div className="control-bar" role="group" aria-label="Playback controls">
      <div className="transport">
        <button className="btn" onClick={viz.prev} disabled={!viz.canPrev} aria-label="Previous step" title="Previous step (←)">
          ◀ Prev
        </button>
        <button
          className="btn btn-primary"
          onClick={viz.togglePlay}
          disabled={viz.totalSteps === 0}
          aria-label={viz.playing ? 'Pause' : 'Play'}
          title="Play / Pause (Space)"
        >
          {viz.playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button className="btn" onClick={viz.next} disabled={!viz.canNext} aria-label="Next step" title="Next step (→)">
          Next ▶
        </button>
        <button className="btn" onClick={viz.reset} disabled={viz.stepIndex === -1 && !viz.playing} aria-label="Reset" title="Reset (R)">
          ↻ Reset
        </button>
      </div>

      <div className="progress-wrap">
        <span className="progress-text" aria-hidden="true">
          {viz.stepIndex + 1} / {viz.totalSteps}
        </span>
        <div
          className="progress-track"
          ref={trackRef}
          onClick={onProgressClick}
          role="slider"
          aria-label="Step progress"
          aria-valuemin={0}
          aria-valuemax={viz.totalSteps}
          aria-valuenow={Math.max(0, viz.stepIndex + 1)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.stopPropagation(); viz.next(); }
            if (e.key === 'ArrowLeft') { e.stopPropagation(); viz.prev(); }
          }}
        >
          <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(1, viz.progress)) * 100}%` }} />
        </div>
        <span className="progress-text">{Math.round(viz.progress * 100)}%</span>
      </div>

      <div className="control-group speed-group">
        <label className="control-label" htmlFor="speed-select">Speed</label>
        <select
          id="speed-select"
          value={viz.speed}
          onChange={(e) => viz.setSpeed(Number(e.target.value))}
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label className="control-label" htmlFor="size-slider">Size</label>
        <input
          id="size-slider"
          className="size-slider"
          type="range"
          min={MIN_SIZE}
          max={MAX_SIZE}
          value={viz.size}
          onChange={handleSizeInput}
        />
        <span className="size-readout">{viz.size}</span>
      </div>

      <button className="btn" onClick={viz.regenerate} title="Generate new array (G)">
        ↻ New Array
      </button>

      <label className="toggle">
        <input type="checkbox" checked={viz.showLabels} onChange={(e) => viz.setShowLabels(e.target.checked)} />
        Values
      </label>
    </div>
  );
}
