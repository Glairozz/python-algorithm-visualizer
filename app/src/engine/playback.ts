/**
 * Pure playback state machine. UI wires this into useReducer; tests exercise
 * it directly without React.
 */

export interface PlaybackState {
  totalSteps: number;
  /** -1 = not started (showing the raw input array). */
  position: number;
  playing: boolean;
  speed: number;
}

export type PlaybackAction =
  | { kind: 'load'; totalSteps: number }
  | { kind: 'play' }
  | { kind: 'pause' }
  | { kind: 'next' }
  | { kind: 'prev' }
  | { kind: 'reset' }
  | { kind: 'seek'; position: number }
  | { kind: 'setSpeed'; speed: number }
  | { kind: 'tick' };

export const SPEEDS = [0.25, 0.5, 1, 2, 4] as const;

export const initialPlayback: PlaybackState = {
  totalSteps: 0,
  position: -1,
  playing: false,
  speed: 1,
};

export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.kind) {
    case 'load':
      return { ...state, totalSteps: action.totalSteps, position: -1, playing: false };
    case 'play':
      if (state.totalSteps === 0) return state;
      // Pressing play on the last step replays from the start.
      if (state.position >= state.totalSteps - 1) {
        return { ...state, position: 0, playing: true };
      }
      return { ...state, position: Math.max(state.position, 0), playing: true };
    case 'pause':
      return { ...state, playing: false };
    case 'next':
      return { ...state, playing: false, position: Math.min(state.position + 1, state.totalSteps - 1) };
    case 'prev':
      return { ...state, playing: false, position: Math.max(state.position - 1, -1) };
    case 'reset':
      return { ...state, playing: false, position: -1 };
    case 'seek': {
      const clamped = Math.max(-1, Math.min(action.position, state.totalSteps - 1));
      return { ...state, playing: false, position: clamped };
    }
    case 'setSpeed':
      return { ...state, speed: action.speed };
    case 'tick':
      if (!state.playing) return state;
      if (state.position >= state.totalSteps - 1) return { ...state, playing: false };
      return { ...state, position: state.position + 1 };
    default:
      return state;
  }
}

/** Milliseconds per step at a given speed multiplier. */
export function stepDuration(speed: number): number {
  const BASE = 800;
  return BASE / Math.max(speed, 0.05);
}

/** 0–1 progress through the recorded steps. */
export function progress(state: PlaybackState): number {
  if (state.totalSteps === 0) return 0;
  return (state.position + 1) / state.totalSteps;
}
