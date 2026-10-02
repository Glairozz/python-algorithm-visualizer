import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder } from '../recorder';

const pseudocode = [
  'for i in range(n):',
  '    if arr[i] == target:',
  '        return i',
  'return -1',
];

function generate(input: number[], target?: number): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;
  const t = target ?? (n > 0 ? rec.arr[n - 1] : undefined);

  if (n === 0 || t === undefined) {
    rec.push('complete', 'DONE', 'There is nothing to search.', 3);
    return rec.steps;
  }

  rec.push('info', 'START', `Searching for ${t}. Checking each element from left to right.`, 0);
  for (let i = 0; i < n; i++) {
    rec.push('compare', 'COMPARE', `Is arr[${i}] (${rec.arr[i]}) equal to ${t}?`, 1, { comparing: [i], highlight: [i] }, [{ label: 'i', index: i }]);
    if (rec.arr[i] === t) {
      rec.push('found', 'FOUND', `Found ${t} at index ${i}.`, 2, { found: [i], highlight: [] }, [{ label: 'i', index: i }]);
      return rec.steps;
    }
    rec.eliminate(i);
    rec.push('eliminate', 'ELIMINATE', `${rec.arr[i]} ≠ ${t}, so index ${i} cannot be the answer.`, 1, {}, []);
  }
  rec.push('complete', 'NOT FOUND', `${t} does not appear in the array.`, 3);
  return rec.steps;
}

export const linearSearch: AlgorithmDefinition = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  tagline: 'Scan every element, left to right.',
  description:
    'Linear Search inspects each element in turn and stops at the first match. It needs no ordering, but it may visit every element.',
  howItWorks: [
    'Start at index 0.',
    'Compare the current element with the target.',
    'Match → return the index. Otherwise continue.',
    'End of the array → not found.',
  ],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  pseudocode,
  usesTarget: true,
  generate,
};
