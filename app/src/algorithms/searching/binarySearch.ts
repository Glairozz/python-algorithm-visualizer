import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'low = 0; high = n - 1',
  'while low <= high:',
  '    mid = (low + high) // 2',
  '    if arr[mid] == target: return mid',
  '    if target < arr[mid]: high = mid - 1',
  '    else: low = mid + 1',
  'return -1',
];

function generate(input: number[], target?: number): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;
  const t = target ?? (n > 0 ? rec.arr[n - 1] : undefined);

  if (n === 0 || t === undefined) {
    rec.push('complete', 'DONE', 'There is nothing to search.', 6);
    return rec.steps;
  }

  rec.push('info', 'START', `Searching for ${t} in a sorted array of ${n} elements.`, 0);
  let low = 0;
  let high = n - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    rec.push('compare', 'COMPARE', `mid = (${low} + ${high}) // 2 = ${mid}. Is arr[${mid}] (${rec.arr[mid]}) equal to ${t}?`, 2, { comparing: [mid], highlight: range(low, high), pivot: [mid] }, [{ label: 'low', index: low }, { label: 'mid', index: mid }, { label: 'high', index: high }]);
    if (rec.arr[mid] === t) {
      rec.push('found', 'FOUND', `Found ${t} at index ${mid}.`, 3, { found: [mid], highlight: [] }, [{ label: 'low', index: low }, { label: 'mid', index: mid }, { label: 'high', index: high }]);
      return rec.steps;
    }
    if (t < rec.arr[mid]) {
      rec.eliminateRange(mid, high);
      rec.push('eliminate', 'ELIMINATE RIGHT', `${t} < ${rec.arr[mid]}, so everything at index ≥ ${mid} can be discarded.`, 4, { highlight: range(low, mid - 1) }, [{ label: 'low', index: low }, { label: 'high', index: Math.max(mid - 1, low) }]);
      high = mid - 1;
    } else {
      rec.eliminateRange(low, mid);
      rec.push('eliminate', 'ELIMINATE LEFT', `${t} > ${rec.arr[mid]}, so everything at index ≤ ${mid} can be discarded.`, 5, { highlight: range(mid + 1, high) }, [{ label: 'low', index: Math.min(mid + 1, high) }, { label: 'high', index: high }]);
      low = mid + 1;
    }
  }
  rec.push('complete', 'NOT FOUND', `${t} does not appear in the array.`, 6);
  return rec.steps;
}

export const binarySearch: AlgorithmDefinition = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  tagline: 'Halve the search space on every step.',
  description:
    'Binary Search works on sorted arrays. It probes the middle element and discards the half that cannot contain the target, repeating until the target is found or the range is empty.',
  howItWorks: [
    'Set low and high to the array bounds.',
    'Compute mid and inspect arr[mid].',
    'Match → done. Target smaller → discard the right half.',
    'Target larger → discard the left half.',
    'Repeat until the range is empty.',
  ],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  pseudocode,
  usesTarget: true,
  requiresSortedInput: true,
  generate,
};
