import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'function quickSort(lo, hi):',
  '    if lo >= hi: return',
  '    p = partition(lo, hi)',
  '    quickSort(lo, p - 1); quickSort(p + 1, hi)',
  '',
  'partition: pivot = arr[hi]; i = lo - 1',
  '    for j in range(lo, hi):',
  '        if arr[j] < pivot: i++; swap(arr[i], arr[j])',
  '    swap(arr[i + 1], arr[hi]); return i + 1',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }

  function quickSort(lo: number, hi: number): void {
    if (lo >= hi) {
      if (lo === hi) rec.markSorted(lo);
      return;
    }
    const pivot = rec.arr[hi];
    rec.push('pivot', 'PIVOT', `Choosing pivot ${pivot} at index ${hi}.`, 5, { pivot: [hi], highlight: range(lo, hi) }, [{ label: 'pivot', index: hi }]);
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      rec.push('compare', 'COMPARE', `Comparing ${rec.arr[j]} with pivot ${pivot}.`, 7, { comparing: [j], pivot: [hi], highlight: range(lo, hi) }, [{ label: 'j', index: j }, { label: 'i', index: Math.max(i, lo) }]);
      if (rec.arr[j] < pivot) {
        i++;
        if (i !== j) {
          const a = rec.arr[i];
          const b = rec.arr[j];
          rec.arr[i] = b;
          rec.arr[j] = a;
          rec.push('swap', 'SWAP', `${b} < ${pivot}, so swapping ${a} and ${b} to grow the "smaller than pivot" region.`, 7, { swapping: [i, j], pivot: [hi], highlight: range(lo, hi) });
        }
      }
    }
    const a = rec.arr[i + 1];
    rec.arr[i + 1] = rec.arr[hi];
    rec.arr[hi] = a;
    rec.markSorted(i + 1);
    rec.push('swap', 'PLACE PIVOT', `Placing pivot ${pivot} at index ${i + 1} — its final position.`, 8, { swapping: [i + 1, hi], highlight: range(lo, hi) }, [{ label: 'pivot', index: i + 1 }]);
    rec.push('mark_sorted', 'SORTED', `Pivot ${pivot} is now in its final position at index ${i + 1}.`, 8, {}, []);
    quickSort(lo, i);
    quickSort(i + 2, hi);
  }

  quickSort(0, n - 1);
  rec.markAllSorted();
  rec.push('complete', 'DONE', 'All partitions are sorted — the array is sorted.', 3);
  return rec.steps;
}

export const quickSort: AlgorithmDefinition = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  tagline: 'Partition around a pivot, then recurse.',
  description:
    'Quick Sort picks a pivot element, partitions the array so smaller values land left and larger values land right, then recursively sorts both sides.',
  howItWorks: [
    'Choose a pivot element.',
    'Partition: smaller values go left, larger values go right.',
    'Place the pivot in its final position.',
    'Recursively sort both partitions.',
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  pseudocode,
  generate,
};
