import type { AlgorithmDefinition } from '../engine/types';
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { insertionSort } from './sorting/insertionSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';
import { heapSort } from './sorting/heapSort';
import { linearSearch } from './searching/linearSearch';
import { binarySearch } from './searching/binarySearch';

export const algorithms: AlgorithmDefinition[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
];

export function getAlgorithm(id: string): AlgorithmDefinition | undefined {
  return algorithms.find((a) => a.id === id);
}

export function algorithmsByCategory(): Map<string, AlgorithmDefinition[]> {
  const map = new Map<string, AlgorithmDefinition[]>();
  for (const algo of algorithms) {
    const list = map.get(algo.category) ?? [];
    list.push(algo);
    map.set(algo.category, list);
  }
  return map;
}
