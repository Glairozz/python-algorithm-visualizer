import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'for i in range(1, n):',
  '    key = arr[i]',
  '    j = i - 1',
  '    while j >= 0 and arr[j] > key:',
  '        arr[j + 1] = arr[j]; j -= 1',
  '    arr[j + 1] = key',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }
  rec.markSorted(0);

  for (let i = 1; i < n; i++) {
    const key = rec.arr[i];
    rec.push('select', 'KEY', `Taking ${key} as the key to insert into the sorted prefix.`, 1, { pivot: [i], highlight: range(0, i) }, [{ label: 'i', index: i }]);
    let j = i - 1;
    while (j >= 0 && rec.arr[j] > key) {
      rec.push('compare', 'COMPARE', `${rec.arr[j]} > ${key}, so shift ${rec.arr[j]} one slot right.`, 3, { comparing: [j, j + 1], pivot: [j + 1], highlight: range(0, i) }, [{ label: 'j', index: j }]);
      rec.arr[j + 1] = rec.arr[j];
      rec.push('overwrite', 'SHIFT', `Moved ${rec.arr[j + 1]} into index ${j + 1}.`, 4, { swapping: [j + 1], highlight: range(0, i) });
      j -= 1;
    }
    if (j >= 0) {
      rec.push('info', 'STOP', `${rec.arr[j]} ≤ ${key}, so ${key} belongs right after it.`, 3, { comparing: [j, j + 1], highlight: range(0, i) }, [{ label: 'j', index: j }]);
    }
    rec.arr[j + 1] = key;
    rec.push('overwrite', 'INSERT', `Inserted ${key} at index ${j + 1}.`, 5, { swapping: [j + 1], highlight: range(0, i) });
    rec.markRangeSorted(0, i);
    rec.push('mark_sorted', 'SORTED', `The prefix [0..${i}] is now sorted.`, 5);
  }
  rec.push('complete', 'DONE', 'Every element has been inserted into place — the array is sorted.', 5);
  return rec.steps;
}

export const insertionSort: AlgorithmDefinition = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  tagline: 'Grow a sorted prefix by inserting each new key.',
  description:
    'Insertion Sort builds a sorted prefix one element at a time. Each new key is shifted into its correct position among the previously sorted elements.',
  howItWorks: [
    'Take the next element as the key.',
    'Compare it with elements in the sorted prefix.',
    'Shift larger elements one position to the right.',
    'Drop the key into the gap.',
  ],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  pseudocode,
  generate,
};
