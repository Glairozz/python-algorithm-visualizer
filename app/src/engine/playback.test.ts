import { describe, expect, it } from 'vitest';
import { initialPlayback, playbackReducer, progress, stepDuration } from './playback';

const loaded = playbackReducer(initialPlayback, { kind: 'load', totalSteps: 5 });

describe('playback reducer', () => {
  it('starts idle with no steps', () => {
    expect(initialPlayback.position).toBe(-1);
    expect(initialPlayback.playing).toBe(false);
    expect(initialPlayback.totalSteps).toBe(0);
  });

  it('load resets position and pauses', () => {
    expect(loaded.position).toBe(-1);
    expect(loaded.playing).toBe(false);
    expect(loaded.totalSteps).toBe(5);
  });

  it('play advances from the start and pauses at the end', () => {
    let s = playbackReducer(loaded, { kind: 'play' });
    expect(s.playing).toBe(true);
    expect(s.position).toBe(0);
    for (let i = 0; i < 10; i++) s = playbackReducer(s, { kind: 'tick' });
    expect(s.playing).toBe(false);
    expect(s.position).toBe(4);
  });

  it('pressing play on the last step replays from the start', () => {
    let s = playbackReducer(loaded, { kind: 'seek', position: 4 });
    s = playbackReducer(s, { kind: 'play' });
    expect(s.position).toBe(0);
    expect(s.playing).toBe(true);
  });

  it('next and prev move one step and pause', () => {
    let s = playbackReducer(loaded, { kind: 'play' });
    s = playbackReducer(s, { kind: 'next' });
    expect(s.position).toBe(1);
    expect(s.playing).toBe(false);
    s = playbackReducer(s, { kind: 'prev' });
    expect(s.position).toBe(0);
  });

  it('prev clamps at -1 and next clamps at the end', () => {
    let s = playbackReducer(loaded, { kind: 'prev' });
    expect(s.position).toBe(-1);
    s = playbackReducer(loaded, { kind: 'seek', position: 4 });
    s = playbackReducer(s, { kind: 'next' });
    expect(s.position).toBe(4);
  });

  it('reset returns to not started', () => {
    let s = playbackReducer(loaded, { kind: 'seek', position: 3 });
    s = playbackReducer(s, { kind: 'reset' });
    expect(s.position).toBe(-1);
    expect(s.playing).toBe(false);
  });

  it('seek clamps to valid range', () => {
    expect(playbackReducer(loaded, { kind: 'seek', position: 99 }).position).toBe(4);
    expect(playbackReducer(loaded, { kind: 'seek', position: -99 }).position).toBe(-1);
  });

  it('setSpeed updates speed', () => {
    expect(playbackReducer(loaded, { kind: 'setSpeed', speed: 4 }).speed).toBe(4);
  });
});

describe('progress / duration', () => {
  it('progress is 0 with no steps and grows with position', () => {
    expect(progress(initialPlayback)).toBe(0);
    expect(progress(loaded)).toBeCloseTo(0);
    expect(progress({ ...loaded, position: 4 })).toBeCloseTo(1);
  });

  it('step duration shrinks as speed grows', () => {
    expect(stepDuration(4)).toBeLessThan(stepDuration(1));
    expect(stepDuration(1)).toBeLessThan(stepDuration(0.25));
  });
});
