import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'for i in range(n - 1):',
  '    for j in range(n - i - 1):',
  '        if arr[j] > arr[j + 1]:',
  '            swap(arr[j], arr[j + 1])',
  '    mark arr[n - i - 1] as sorted',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      rec.push(
        'compare',
        'COMPARE',
        `Comparing ${rec.arr[j]} and ${rec.arr[j + 1]}.`,
        2,
        { comparing: [j, j + 1], highlight: range(0, n - i - 1) },
        [
          { label: 'i', index: n - i - 1 },
          { label: 'j', index: j },
        ],
      );
      if (rec.arr[j] > rec.arr[j + 1]) {
        const a = rec.arr[j];
        const b = rec.arr[j + 1];
        rec.arr[j] = b;
        rec.arr[j + 1] = a;
        swapped = true;
        rec.push(
          'swap',
          'SWAP',
          `Swapping ${a} and ${b}. ${a} is greater than ${b}, so their positions are exchanged.`,
          3,
          { swapping: [j, j + 1], highlight: range(0, n - i - 1) },
          [{ label: 'j', index: j }],
        );
      } else {
        rec.push(
          'info',
          'NO SWAP',
          `Since ${rec.arr[j]} ≤ ${rec.arr[j + 1]}, no swap is needed.`,
          2,
          { comparing: [j, j + 1], highlight: range(0, n - i - 1) },
          [{ label: 'j', index: j }],
        );
      }
    }
    rec.markSorted(n - i - 1);
    rec.push(
      'mark_sorted',
      'SORTED',
      `${rec.arr[n - i - 1]} bubbled to its final position at index ${n - i - 1}.`,
      4,
      {},
      [{ label: 'i', index: n - i - 1 }],
    );
    if (!swapped) {
      rec.markAllSorted();
      rec.push(
        'complete',
        'EARLY EXIT',
        'A full pass made no swaps — the array is already sorted.',
        4,
      );
      return rec.steps;
    }
  }
  rec.markAllSorted();
  rec.push('complete', 'DONE', 'Every pass is complete — the array is sorted.', 4);
  return rec.steps;
}

export const bubbleSort: AlgorithmDefinition = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  tagline: 'Repeatedly swap adjacent out-of-order pairs.',
  description:
    'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them when they are in the wrong order. After each pass, the largest unsorted element "bubbles up" to its final position.',
  howItWorks: [
    'Compare two adjacent elements.',
    'Swap them if they are in the wrong order.',
    'Move on to the next pair.',
    'After a full pass, the largest unsorted value is in place.',
    'Repeat until a pass makes no swaps.',
  ],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  pseudocode,
  generate,
};
