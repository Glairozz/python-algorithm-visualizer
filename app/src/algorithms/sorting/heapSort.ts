import type { AlgorithmDefinition, Step } from '../../engine/types';
import { Recorder, range } from '../recorder';

const pseudocode = [
  'build a max-heap from the array',
  'for end in range(n - 1, 0, -1):',
  '    swap(arr[0], arr[end])',
  '    mark arr[end] as sorted',
  '    siftDown(0, end)',
];

function generate(input: number[]): Step[] {
  const rec = new Recorder(input);
  const n = rec.arr.length;

  if (n === 0) {
    rec.push('complete', 'DONE', 'The array is empty — nothing to sort.', 0);
    return rec.steps;
  }

  function siftDown(root: number, end: number): void {
    let current = root;
    for (;;) {
      let largest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;
      if (left < end) {
        rec.push('compare', 'COMPARE', `Comparing ${rec.arr[left]} with ${rec.arr[largest]}.`, 4, { comparing: [left, largest], highlight: range(0, end - 1) }, [{ label: 'root', index: current }]);
        if (rec.arr[left] > rec.arr[largest]) largest = left;
      }
      if (right < end) {
        rec.push('compare', 'COMPARE', `Comparing ${rec.arr[right]} with ${rec.arr[largest]}.`, 4, { comparing: [right, largest], highlight: range(0, end - 1) }, [{ label: 'root', index: current }]);
        if (rec.arr[right] > rec.arr[largest]) largest = right;
      }
      if (largest === current) {
        rec.push('info', 'OK', `${rec.arr[current]} is already the largest of its children — heap property holds.`, 4, { pivot: [current], highlight: range(0, end - 1) });
        return;
      }
      const a = rec.arr[current];
      const b = rec.arr[largest];
      rec.arr[current] = b;
      rec.arr[largest] = a;
      rec.push('swap', 'SWAP', `Swapping ${a} and ${b} to restore the max-heap.`, 4, { swapping: [current, largest], highlight: range(0, end - 1) });
      current = largest;
    }
  }

  rec.push('info', 'BUILD HEAP', 'Rearranging the array into a max-heap: every parent is ≥ its children.', 0);
  for (let start = ((n - 2) >> 1); start >= 0; start--) {
    siftDown(start, n);
  }
  rec.push('info', 'HEAP BUILT', 'Max-heap built — the largest element is at index 0.', 0);

  for (let end = n - 1; end > 0; end--) {
    const a = rec.arr[0];
    const b = rec.arr[end];
    rec.arr[0] = b;
    rec.arr[end] = a;
    rec.markSorted(end);
    rec.push('swap', 'EXTRACT MAX', `Moving max ${a} to its final position at index ${end}.`, 2, { swapping: [0, end] });
    rec.push('mark_sorted', 'SORTED', `${rec.arr[end]} is in final position; heap shrinks to [0..${end - 1}].`, 3, {});
    siftDown(0, end);
  }
  rec.markAllSorted();
  rec.push('complete', 'DONE', 'Heap emptied — the array is sorted.', 4);
  return rec.steps;
}

export const heapSort: AlgorithmDefinition = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'Sorting',
  tagline: 'Heapify, then repeatedly extract the max.',
  description:
    'Heap Sort turns the array into a max-heap, then repeatedly swaps the root (the maximum) into the sorted tail and re-heapifies the shrinking prefix.',
  howItWorks: [
    'Build a max-heap from the array.',
    'Swap the root with the last unsorted element.',
    'Shrink the heap and sift the new root down.',
    'Repeat until one element remains.',
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  pseudocode,
  generate,
};
