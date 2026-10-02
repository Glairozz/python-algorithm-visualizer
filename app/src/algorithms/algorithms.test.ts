import { describe, expect, it } from 'vitest';
import { algorithms, getAlgorithm } from '../algorithms';
import type { AlgorithmDefinition } from '../engine/types';

const cases: Array<[string, number[]]> = [
  ['empty', []],
  ['single', [7]],
  ['sorted', [1, 2, 3, 4, 5]],
  ['reverse sorted', [9, 7, 5, 3, 1]],
  ['duplicates', [4, 2, 4, 1, 2, 4]],
  ['negatives', [-3, 5, -10, 0, 8, -1]],
  ['two elements', [2, 1]],
  ['larger random', Array.from({ length: 40 }, (_, i) => ((i * 37) % 53) - 26)],
];

const sorters = algorithms.filter((a) => a.category === 'Sorting');

describe('sorting algorithms', () => {
  for (const algo of sorters) {
    describe(algo.name, () => {
      for (const [label, input] of cases) {
        it(`sorts ${label} input`, () => {
          const steps = algo.generate(input);
          const finalFrame = steps[steps.length - 1].frame;
          expect([...finalFrame.array].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
          expect(finalFrame.array).toEqual([...input].sort((a, b) => a - b));
        });
      }

      it('produces well-formed steps', () => {
        const input = [5, 3, 8, 1, 9, 2];
        const steps = algo.generate(input);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps[steps.length - 1].type).toBe('complete');
        for (const step of steps) {
          expect(step.frame.array).toHaveLength(input.length);
          expect(step.explanation.length).toBeGreaterThan(0);
          expect(step.codeLine).toBeGreaterThanOrEqual(0);
          expect(step.codeLine).toBeLessThan(algo.pseudocode.length);
        }
      });
    });
  }
});

describe('searching algorithms', () => {
  const searchers = algorithms.filter((a) => a.category === 'Searching');
  const sorted = [3, 8, 12, 19, 24, 31, 40, 55, 68, 90];

  for (const algo of searchers) {
    it(`${algo.name} finds a present target`, () => {
      const target = sorted[6];
      const steps = algo.generate(sorted, target);
      const found = steps.find((s) => s.type === 'found');
      expect(found).toBeDefined();
      expect(found!.frame.found).toEqual([6]);
    });

    it(`${algo.name} reports a missing target`, () => {
      const steps = algo.generate(sorted, 42);
      expect(steps.some((s) => s.type === 'found')).toBe(false);
      expect(steps[steps.length - 1].type).toBe('complete');
    });

    it(`${algo.name} handles empty input`, () => {
      const steps = algo.generate([], 5);
      expect(steps[steps.length - 1].type).toBe('complete');
    });
  }
});

describe('registry', () => {
  it('has unique ids and all expected algorithms', () => {
    const ids = algorithms.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'linear-search', 'binary-search']) {
      expect(getAlgorithm(id)).toBeDefined();
    }
  });

  it('every algorithm has metadata', () => {
    for (const algo of algorithms as AlgorithmDefinition[]) {
      expect(algo.name.length).toBeGreaterThan(0);
      expect(algo.description.length).toBeGreaterThan(0);
      expect(algo.howItWorks.length).toBeGreaterThan(0);
      expect(algo.pseudocode.length).toBeGreaterThan(0);
      expect(algo.complexity.worst.length).toBeGreaterThan(0);
    }
  });
});
