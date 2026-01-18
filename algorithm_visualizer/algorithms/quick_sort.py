from typing import List
from .base_algorithm import BaseAlgorithm
from ..core.timeline import Timeline
from ..core.step import Step


class QuickSort(BaseAlgorithm):
    def __init__(self):
        super().__init__(
            name="Quick Sort",
            description="An efficient, in-place sorting algorithm that uses divide-and-conquer strategy with a pivot element."
        )
        self.complexity = {
            'best': 'O(n log n)',
            'average': 'O(n log n)',
            'worst': 'O(n²)',
            'space': 'O(log n)'
        }
    
    def execute(self, array: List) -> Timeline:
        timeline = Timeline(array)
        arr = array.copy()
        self._quick_sort(arr, 0, len(arr) - 1, timeline)
        return timeline
    
    def _quick_sort(self, arr: List, low: int, high: int, timeline: Timeline):
        if low < high:
            pivot_index = self._partition(arr, low, high, timeline)
            
            timeline.add_step(Step.mark_sorted(
                [pivot_index],
                f"Pivot element {arr[pivot_index]} is now in its final position at index {pivot_index}"
            ))
            
            self._quick_sort(arr, low, pivot_index - 1, timeline)
            self._quick_sort(arr, pivot_index + 1, high, timeline)
    
    def _partition(self, arr: List, low: int, high: int, timeline: Timeline) -> int:
        pivot = arr[high]
        timeline.add_step(Step.pivot(
            high,
            f"Choosing {pivot} as pivot element at position {high}"
        ))
        
        i = low - 1
        
        for j in range(low, high):
            timeline.add_step(Step.compare(
                j, high,
                f"Comparing {arr[j]} with pivot {pivot}"
            ))
            
            if arr[j] <= pivot:
                i += 1
                if i != j:
                    timeline.add_step(Step.swap(
                        i, j,
                        f"Moving {arr[j]} to left of pivot"
                    ))
                    arr[i], arr[j] = arr[j], arr[i]
        
        if i + 1 != high:
            timeline.add_step(Step.swap(
                i + 1, high,
                f"Placing pivot {pivot} in its final position"
            ))
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
        
        return i + 1