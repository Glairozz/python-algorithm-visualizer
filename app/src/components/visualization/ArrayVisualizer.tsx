import { memo } from 'react';
import type { Frame, Pointer } from '../../engine/types';

interface ArrayVisualizerProps {
  frame: Frame;
  pointers: Pointer[];
  showLabels: boolean;
  showIndices: boolean;
}

type BarState = 'found' | 'swapping' | 'comparing' | 'pivot' | 'sorted' | 'eliminated' | 'highlight' | 'idle';

function stateFor(index: number, frame: Frame): BarState {
  if (frame.found.includes(index)) return 'found';
  if (frame.swapping.includes(index)) return 'swapping';
  if (frame.comparing.includes(index)) return 'comparing';
  if (frame.pivot.includes(index)) return 'pivot';
  if (frame.sorted.includes(index)) return 'sorted';
  if (frame.eliminated.includes(index)) return 'eliminated';
  if (frame.highlight.includes(index)) return 'highlight';
  return 'idle';
}

interface BarProps {
  value: number;
  heightPct: number;
  state: BarState;
  showLabels: boolean;
}

const Bar = memo(function Bar({ value, heightPct, state, showLabels }: BarProps) {
  return (
    <div
      className={`bar${state === 'idle' ? '' : ` ${state}`}`}
      style={{ height: `${heightPct}%` }}
      title={`value ${value}`}
    >
      {showLabels && <span className="bar-value">{value}</span>}
    </div>
  );
});

export function ArrayVisualizer({ frame, pointers, showLabels, showIndices }: ArrayVisualizerProps) {
  const max = Math.max(1, ...frame.array);
  const pointerByIndex = new Map<number, string[]>();
  for (const p of pointers) {
    const list = pointerByIndex.get(p.index) ?? [];
    list.push(p.label);
    pointerByIndex.set(p.index, list);
  }
  return (
    <>
      <div className="bars" role="img" aria-label="Array visualization">
        {frame.array.map((value, i) => {
          const labels = pointerByIndex.get(i);
          return (
            <div className="bar-col" key={i}>
              {labels && (
                <span className="pointer-cell" aria-hidden="true">
                  <span className="pointer-tag">{labels.join(' ')} ▼</span>
                </span>
              )}
              <Bar value={value} heightPct={Math.max(6, (value / max) * 100)} state={stateFor(i, frame)} showLabels={showLabels} />
            </div>
          );
        })}
      </div>
      {showIndices && (
        <div className="index-row" aria-hidden="true">
          {frame.array.map((_, i) => (
            <div className="index-cell" key={i}>
              {i}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
