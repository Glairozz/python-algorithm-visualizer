import type { Frame, Pointer, Step, StepType } from '../engine/types';

/**
 * Records steps while a raw algorithm (operating on a plain number[]) runs.
 * Persistent sets (sorted / eliminated) are carried forward into each frame
 * so each Step contains a complete, self-contained visual state.
 */
export class Recorder {
  readonly arr: number[];
  private sortedSet = new Set<number>();
  private eliminatedSet = new Set<number>();
  readonly steps: Step[] = [];

  constructor(input: number[]) {
    this.arr = [...input];
  }

  markSorted(...indices: number[]): void {
    indices.forEach((i) => this.sortedSet.add(i));
  }

  markRangeSorted(from: number, to: number): void {
    for (let i = from; i <= to; i++) this.sortedSet.add(i);
  }

  markAllSorted(): void {
    for (let i = 0; i < this.arr.length; i++) this.sortedSet.add(i);
  }

  eliminate(...indices: number[]): void {
    indices.forEach((i) => this.eliminatedSet.add(i));
  }

  eliminateRange(from: number, to: number): void {
    for (let i = from; i <= to; i++) this.eliminatedSet.add(i);
  }

  push(
    type: StepType,
    operation: string,
    explanation: string,
    codeLine: number,
    extra?: Partial<Frame>,
    pointers: Pointer[] = [],
  ): void {
    this.steps.push({
      type,
      operation,
      explanation,
      codeLine,
      frame: {
        array: [...this.arr],
        comparing: [],
        swapping: [],
        pivot: [],
        highlight: [],
        found: [],
        sorted: [...this.sortedSet].sort((a, b) => a - b),
        eliminated: [...this.eliminatedSet].sort((a, b) => a - b),
        ...extra,
      },
      pointers: pointers.map((p) => ({ ...p })),
    });
  }
}

export function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}
