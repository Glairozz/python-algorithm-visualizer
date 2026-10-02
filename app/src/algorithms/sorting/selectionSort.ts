import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'for i in range(n):',
  '    min = i',
  '    for j in range(i + 1, n):',
  '        if arr[j] < arr[min]:',
  '            min = j',
  '    swap(arr[i], arr[min])',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }

  for (let i = 0; i < n; i++) {
    let min = i;
    rec.push('select', 'SELECT', `Assuming ${rec.arr[i]} at index ${i} is the minimum.`, 1, { pivot: [i], highlight: range(i, n - 1) }, [{ label: 'i', index: i }]);
    for (let j = i + 1; j < n; j++) {
      rec.push('compare', 'COMPARE', `Comparing ${rec.arr[j]} with current minimum ${rec.arr[min]}.`, 3, { comparing: [j, min], pivot: [min], highlight: range(i, n - 1) }, [{ label: 'j', index: j }]);
      if (rec.arr[j] < rec.arr[min]) {
        min = j;
        rec.push('select', 'NEW MIN', `${rec.arr[j]} is smaller, so index ${j} is the new minimum.`, 4, { pivot: [min], highlight: range(i, n - 1) }, [{ label: 'min', index: min }]);
      }
    }
    if (min !== i) {
      const a = rec.arr[i];
      const b = rec.arr[min];
      rec.arr[i] = b;
      rec.arr[min] = a;
      rec.push('swap', 'SWAP', `Swapping ${a} and ${b} to place the minimum at index ${i}.`, 5, { swapping: [i, min] });
    } else {
      rec.push('info', 'NO SWAP', `${rec.arr[i]} is already the minimum of the remaining range.`, 5, { pivot: [i] });
    }
    rec.markSorted(i);
    rec.push('mark_sorted', 'SORTED', `${rec.arr[i]} is now in its final position at index ${i}.`, 5);
  }
  rec.push('complete', 'DONE', 'Every position has been filled with the smallest remaining value — the array is sorted.', 5);
  return rec.steps;
}

export const selectionSort: AlgorithmDefinition = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  tagline: 'Select the minimum, place it first, repeat.',
  description:
    'Selection Sort splits the array into a sorted and an unsorted region. Each pass finds the smallest value in the unsorted region and moves it to the boundary.',
  howItWorks: [
    'Assume the first unsorted element is the minimum.',
    'Scan the rest of the unsorted region for a smaller value.',
    'Swap the minimum into the first unsorted position.',
    'Grow the sorted region by one and repeat.',
  ],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  pseudocode,
  generate,
};
