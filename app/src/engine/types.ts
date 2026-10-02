/**
 * Algorithm engine — UI-independent model.
 *
 * Every algorithm is a pure generator: it takes the input array and returns a
 * fully recorded list of steps. The UI never re-runs algorithm logic; it only
 * renders step snapshots. This makes the engine trivially testable.
 */

export type StepType =
  | 'compare'
  | 'swap'
  | 'select'
  | 'overwrite'
  | 'mark_sorted'
  | 'highlight'
  | 'pivot'
  | 'merge'
  | 'visit'
  | 'eliminate'
  | 'found'
  | 'info'
  | 'complete';

/** Complete visual state of the array at a single step. */
export interface Frame {
  array: number[];
  /** Hatched: elements being compared right now. */
  comparing: number[];
  /** Solid black: elements being swapped right now. */
  swapping: number[];
  /** Gray: elements in their final (processed) position. */
  sorted: number[];
  /** Thick outlined: current pivot / current element. */
  pivot: number[];
  /** Light gray: the active sub-range of interest. */
  highlight: number[];
  /** Dashed: range eliminated from consideration (searching). */
  eliminated: number[];
  /** Solid black w/ white text: search hit. */
  found: number[];
}

export interface Pointer {
  label: string;
  index: number;
}

export interface Step {
  type: StepType;
  /** Short machine label for the operation, e.g. "COMPARE". */
  operation: string;
  /** Human-readable explanation of *why*, e.g. "7 < 12, so no swap.". */
  explanation: string;
  /** 0-based index into the algorithm's pseudocode array. */
  codeLine: number;
  frame: Frame;
  pointers: Pointer[];
}

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export type AlgorithmCategory = 'Sorting' | 'Searching';

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: AlgorithmCategory;
  /** One-line summary shown in the sidebar / info panel. */
  tagline: string;
  /** Beginner-friendly paragraph. */
  description: string;
  howItWorks: string[];
  complexity: Complexity;
  pseudocode: string[];
  /** Searching algorithms need a target value. */
  usesTarget?: boolean;
  /** Searching algorithms require sorted input. */
  requiresSortedInput?: boolean;
  /** Generate the full recorded step list for the given input. */
  generate(input: number[], target?: number): Step[];
}

/** Empty frame helper — every generator starts from this shape. */
export function emptyFrame(array: number[]): Frame {
  return {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: [],
    highlight: [],
    eliminated: [],
    found: [],
  };
}
