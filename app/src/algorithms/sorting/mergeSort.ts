import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'function mergeSort(lo, hi):',
  '    if lo >= hi: return',
  '    mid = (lo + hi) // 2',
  '    mergeSort(lo, mid); mergeSort(mid + 1, hi)',
  '    merge the two sorted halves',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }

  function mergeSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    rec.push('info', 'DIVIDE', `Splitting range [${lo}..${hi}] at midpoint ${mid}.`, 2, { highlight: range(lo, hi) }, [{ label: 'lo', index: lo }, { label: 'hi', index: hi }]);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);

    const left = rec.arr.slice(lo, mid + 1);
    const right = rec.arr.slice(mid + 1, hi + 1);
    rec.push('merge', 'MERGE', `Merging [${left.join(', ')}] and [${right.join(', ')}].`, 4, { highlight: range(lo, hi), comparing: range(lo, hi) }, [{ label: 'lo', index: lo }, { label: 'hi', index: hi }]);

    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length && j < right.length) {
      rec.push('compare', 'COMPARE', `Comparing ${left[i]} and ${right[j]}.`, 4, { comparing: [lo + i, mid + 1 + j], highlight: range(lo, hi) });
      if (left[i] <= right[j]) {
        rec.arr[k] = left[i];
        rec.push('overwrite', 'WRITE', `Placing ${left[i]} at index ${k}.`, 4, { swapping: [k], highlight: range(lo, hi) });
        i++;
      } else {
        rec.arr[k] = right[j];
        rec.push('overwrite', 'WRITE', `Placing ${right[j]} at index ${k}.`, 4, { swapping: [k], highlight: range(lo, hi) });
        j++;
      }
      k++;
    }
    while (i < left.length) {
      rec.arr[k] = left[i];
      rec.push('overwrite', 'WRITE', `Copying remaining ${left[i]} to index ${k}.`, 4, { swapping: [k], highlight: range(lo, hi) });
      i++;
      k++;
    }
    while (j < right.length) {
      rec.arr[k] = right[j];
      rec.push('overwrite', 'WRITE', `Copying remaining ${right[j]} to index ${k}.`, 4, { swapping: [k], highlight: range(lo, hi) });
      j++;
      k++;
    }
    rec.push('mark_sorted', 'MERGED', `Range [${lo}..${hi}] is merged and sorted.`, 4, { highlight: [] });
  }

  mergeSort(0, n - 1);
  rec.markAllSorted();
  rec.push('complete', 'DONE', 'All halves merged — the array is sorted.', 4);
  return rec.steps;
}

export const mergeSort: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  tagline: 'Divide, conquer, merge.',
  description:
    'Merge Sort divides the array in half, recursively sorts each half, and merges the two sorted halves into one sorted run. It guarantees O(n log n) time.',
  howItWorks: [
    'Split the array into two halves.',
    'Recursively sort each half.',
    'Merge the halves while comparing their fronts.',
    'Write the smaller value into the output, then continue.',
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  pseudocode,
  generate,
};
