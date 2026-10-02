from typing import List
from .base_algorithm import BaseAlgorithm
from ..core.timeline import Timeline
from ..core.step import Step


class BubbleSort(BaseAlgorithm):
    def __init__(self):
        super().__init__(
            name="Bubble Sort",
            description="A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
        )
        self.complexity = {
            'best': 'O(n)',
            'average': 'O(n²)',
            'worst': 'O(n²)',
            'space': 'O(1)'
        }
    
    def execute(self, array: List) -> Timeline:
        timeline = Timeline(array)
        arr = array.copy()
        n = len(arr)
        
        for i in range(n):
            swapped = False
            timeline.add_step(Step.highlight(
                list(range(n - i)), 
                f"Pass {i + 1}: Checking unsorted portion"
            ))
            
            for j in range(0, n - i - 1):
                timeline.add_step(Step.compare(
                    j, j + 1,
                    f"Comparing elements at positions {j} and {j + 1}"
                ))
                
                if arr[j] > arr[j + 1]:
                    timeline.add_step(Step.swap(
                        j, j + 1,
                        f"Swapping {arr[j]} and {arr[j + 1]} - they are in wrong order"
                    ))
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            
            timeline.add_step(Step.mark_sorted(
                [n - i - 1],
                f"Element at position {n - i - 1} is now in its final position"
            ))
            
            timeline.add_step(Step.clear_highlight(
                list(range(n - i)),
                "Clearing highlights for next pass"
            ))
            
            if not swapped:
                break
        
        if n > 0:
            timeline.add_step(Step.mark_sorted(
                [0],
                "First element is now sorted"
            ))
        
        return timeline