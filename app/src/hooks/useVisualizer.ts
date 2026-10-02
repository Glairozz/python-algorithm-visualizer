import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getAlgorithm } from '../algorithms';
import { initialPlayback, playbackReducer, stepDuration } from '../engine/playback';
import type { Step } from '../engine/types';

export const MIN_SIZE = 5;
export const MAX_SIZE = 30;
export const DEFAULT_SIZE = 12;

/** Random array with a decent spread of values. */
export function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 89) + 12);
}

/** Sorted array with realistic variation (used for searching algorithms). */
export function sortedArray(size: number): number[] {
  let v = Math.floor(Math.random() * 6) + 8;
  return Array.from({ length: size }, () => {
    v += Math.floor(Math.random() * 8) + 2;
    return v;
  });
}

export interface Visualizer {
  algorithmId: string;
  algorithmName: string;
  size: number;
  data: number[];
  target?: number;
  steps: Step[];
  currentStep: Step | null;
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  speed: number;
  showLabels: boolean;
  canPrev: boolean;
  canNext: boolean;
  progress: number;
  selectAlgorithm: (id: string) => void;
  setSize: (n: number) => void;
  regenerate: () => void;
  setShowLabels: (v: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  seek: (pos: number) => void;
  setSpeed: (speed: number) => void;
}

export function useVisualizer(): Visualizer {
  const [algorithmId, setAlgorithmId] = useState('bubble-sort');
  const [size, setSizeState] = useState(DEFAULT_SIZE);
  const [data, setData] = useState<number[]>(() => randomArray(DEFAULT_SIZE));
  const [target, setTarget] = useState<number | undefined>(undefined);
  const [showLabels, setShowLabels] = useState(true);
  const [playback, dispatch] = useReducer(playbackReducer, initialPlayback);
  const stepsRef = useRef<Step[]>([]);

  const algorithm = getAlgorithm(algorithmId);

  const steps = useMemo<Step[]>(() => {
    if (!algorithm) return [];
    try {
      return algorithm.generate(data, target);
    } catch {
      return [];
    }
  }, [algorithm, data, target]);
  stepsRef.current = steps;

  // Loading a new step list resets playback to "not started".
  useEffect(() => {
    dispatch({ kind: 'load', totalSteps: steps.length });
  }, [steps]);

  // Autoplay ticker. One timer per step; speed changes reset it.
  const { playing, position, speed } = playback;
  useEffect(() => {
    if (!playing) return;
    if (position < 0 && steps.length === 0) return;
    const id = window.setTimeout(() => dispatch({ kind: 'tick' }), stepDuration(speed));
    return () => window.clearTimeout(id);
  }, [playing, position, speed, steps.length]);

  const regenerateData = useCallback(
    (nextSize: number, nextAlgorithmId: string) => {
      const algo = getAlgorithm(nextAlgorithmId);
      const arr = algo?.requiresSortedInput ? sortedArray(nextSize) : randomArray(nextSize);
      setData(arr);
      setTarget(algo?.usesTarget ? arr[Math.floor(Math.random() * arr.length)] : undefined);
    },
    [],
  );

  const selectAlgorithm = useCallback(
    (id: string) => {
      setAlgorithmId(id);
      const algo = getAlgorithm(id);
      const needsSorted = algo?.requiresSortedInput ?? false;
      const isSortedNow = [...data].every((v, i, a) => i === 0 || a[i - 1] <= v);
      let arr = data;
      if (needsSorted && !isSortedNow) arr = [...data].sort((a, b) => a - b);
      if (!needsSorted && isSortedNow && algo && !algo.usesTarget) {
        // Keep current data; sorted input is fine for sorting too.
      }
      if (arr !== data) setData(arr);
      setTarget(algo?.usesTarget ? arr[Math.floor(Math.random() * arr.length)] : undefined);
    },
    [data],
  );

  const setSize = useCallback((n: number) => {
    const clamped = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(n)));
    setSizeState(clamped);
  }, []);

  const regenerate = useCallback(() => {
    regenerateData(size, algorithmId);
  }, [regenerateData, size, algorithmId]);

  // Regenerate when the size slider is released (change event) — handled in the UI
  // by calling setSize + regenerateData via commitSize below.
  const commitSize = useCallback(
    (n: number) => {
      setSize(n);
      regenerateData(Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(n))), algorithmId);
    },
    [setSize, regenerateData, algorithmId],
  );

  const play = useCallback(() => dispatch({ kind: 'play' }), []);
  const pause = useCallback(() => dispatch({ kind: 'pause' }), []);
  const togglePlay = useCallback(() => {
    dispatch({ kind: playback.playing ? 'pause' : 'play' });
  }, [playback.playing]);
  const next = useCallback(() => dispatch({ kind: 'next' }), []);
  const prev = useCallback(() => dispatch({ kind: 'prev' }), []);
  const reset = useCallback(() => dispatch({ kind: 'reset' }), []);
  const seek = useCallback((pos: number) => dispatch({ kind: 'seek', position: pos }), []);
  const setSpeed = useCallback((speed: number) => dispatch({ kind: 'setSpeed', speed }), []);

  const currentStep = position >= 0 && position < steps.length ? steps[position] : null;
  const totalSteps = steps.length;
  const progress = totalSteps === 0 ? 0 : (position + 1) / totalSteps;

  return {
    algorithmId,
    algorithmName: algorithm?.name ?? '',
    size,
    data,
    target,
    steps,
    currentStep,
    stepIndex: position,
    totalSteps,
    playing: playback.playing,
    speed: playback.speed,
    showLabels,
    canPrev: position > -1,
    canNext: position < totalSteps - 1,
    progress,
    selectAlgorithm,
    setSize: commitSize,
    regenerate,
    setShowLabels,
    play,
    pause,
    togglePlay,
    next,
    prev,
    reset,
    seek,
    setSpeed,
  };
}
