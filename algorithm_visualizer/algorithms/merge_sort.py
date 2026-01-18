from typing import List
from .base_algorithm import BaseAlgorithm
from ..core.timeline import Timeline
from ..core.step import Step


class MergeSort(BaseAlgorithm):
    def __init__(self):
        super().__init__(
            name="Merge Sort",
            description="A stable, divide-and-conquer sorting algorithm that divides the array into halves and merges them back in sorted order."
        )
        self.complexity = {
            'best': 'O(n log n)',
            'average': 'O(n log n)',
            'worst': 'O(n log n)',
            'space': 'O(n)'
        }
    
    def execute(self, array: List) -> Timeline:
        timeline = Timeline(array)
        arr = array.copy()
        self._merge_sort(arr, 0, len(arr) - 1, timeline)
        
        for i in range(len(arr)):
            timeline.add_step(Step.mark_sorted(
                [i],
                f"Element {arr[i]} is in its final sorted position"
            ))
        
        return timeline
    
    def _merge_sort(self, arr: List, left: int, right: int, timeline: Timeline):
        if left < right:
            mid = (left + right) // 2
            
            timeline.add_step(Step.highlight(
                list(range(left, right + 1)),
                f"Dividing array from index {left} to {right}"
            ))
            
            self._merge_sort(arr, left, mid, timeline)
            self._merge_sort(arr, mid + 1, right, timeline)
            
            self._merge(arr, left, mid, right, timeline)
            
            timeline.add_step(Step.clear_highlight(
                list(range(left, right + 1)),
                "Merge operation completed"
            ))
    
    def _merge(self, arr: List, left: int, mid: int, right: int, timeline: Timeline):
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        
        timeline.add_step(Step.merge(
            (left, mid + 1),
            (mid + 1, right + 1),
            f"Merging left subarray [{left}:{mid + 1}] with right subarray [{mid + 1}:{right + 1}]"
        ))
        
        i = j = 0
        k = left
        
        while i < len(left_arr) and j < len(right_arr):
            timeline.add_step(Step.compare(
                left + i, mid + 1 + j,
                f"Comparing {left_arr[i]} with {right_arr[j]}"
            ))
            
            if left_arr[i] <= right_arr[j]:
                timeline.add_step(Step.overwrite(
                    k, left_arr[i],
                    f"Placing {left_arr[i]} at position {k}"
                ))
                arr[k] = left_arr[i]
                i += 1
            else:
                timeline.add_step(Step.overwrite(
                    k, right_arr[j],
                    f"Placing {right_arr[j]} at position {k}"
                ))
                arr[k] = right_arr[j]
                j += 1
            k += 1
        
        while i < len(left_arr):
            timeline.add_step(Step.overwrite(
                k, left_arr[i],
                f"Copying remaining {left_arr[i]} to position {k}"
            ))
            arr[k] = left_arr[i]
            i += 1
            k += 1
        
        while j < len(right_arr):
            timeline.add_step(Step.overwrite(
                k, right_arr[j],
                f"Copying remaining {right_arr[j]} to position {k}"
            ))
            arr[k] = right_arr[j]
            j += 1
            k += 1