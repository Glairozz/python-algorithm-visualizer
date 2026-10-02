from typing import Dict, List
from .step import StepType


class ExplanationEngine:
    def __init__(self):
        self.step_explanations = {
            StepType.COMPARE: self._get_compare_explanation,
            StepType.SWAP: self._get_swap_explanation,
            StepType.OVERWRITE: self._get_overwrite_explanation,
            StepType.MARK_SORTED: self._get_mark_sorted_explanation,
            StepType.HIGHLIGHT: self._get_highlight_explanation,
            StepType.CLEAR_HIGHLIGHT: self._get_clear_highlight_explanation,
            StepType.PIVOT: self._get_pivot_explanation,
            StepType.MERGE: self._get_merge_explanation
        }
        
        self.algorithm_contexts = {
            'bubble_sort': {
                'strategy': 'Compare adjacent elements and swap if out of order',
                'key_idea': 'Largest elements "bubble" to the end each pass',
                'when_to_use': 'Small datasets, nearly sorted data, educational purposes'
            },
            'quick_sort': {
                'strategy': 'Select pivot and partition around it',
                'key_idea': 'Divide-and-conquer with average O(n log n) performance',
                'when_to_use': 'Large datasets, when average case performance matters most'
            },
            'merge_sort': {
                'strategy': 'Divide array into halves and merge back in order',
                'key_idea': 'Stable sort with guaranteed O(n log n) time complexity',
                'when_to_use': 'When stability is required, external sorting, linked lists'
            }
        }
    
    def get_step_explanation(self, step, algorithm_name: str = "") -> str:
        if step.explanation:
            return step.explanation
            
        explanation_func = self.step_explanations.get(step.type)
        if explanation_func:
            return explanation_func(step, algorithm_name)
        return f"Performing {step.type.value} operation"
    
    def _get_compare_explanation(self, step, algorithm_name: str) -> str:
        if algorithm_name == 'bubble_sort':
            return f"Comparing adjacent elements to check if they need to be swapped"
        elif algorithm_name == 'quick_sort':
            return f"Comparing element with pivot to determine which side it belongs"
        elif algorithm_name == 'merge_sort':
            return f"Comparing elements from two sorted subarrays to merge correctly"
        return f"Comparing elements to determine their relative order"
    
    def _get_swap_explanation(self, step, algorithm_name: str) -> str:
        return f"Swapping elements because they are in the wrong order"
    
    def _get_overwrite_explanation(self, step, algorithm_name: str) -> str:
        return f"Placing element at its correct position during merge operation"
    
    def _get_mark_sorted_explanation(self, step, algorithm_name: str) -> str:
        return f"Marking element(s) as sorted - they will not be moved again"
    
    def _get_highlight_explanation(self, step, algorithm_name: str) -> str:
        return f"Highlighting active region for current operation"
    
    def _get_clear_highlight_explanation(self, step, algorithm_name: str) -> str:
        return f"Clearing highlights as operation completes"
    
    def _get_pivot_explanation(self, step, algorithm_name: str) -> str:
        return f"Selecting pivot element - elements will be partitioned around it"
    
    def _get_merge_explanation(self, step, algorithm_name: str) -> str:
        return f"Merging two sorted subarrays into one larger sorted array"
    
    def get_algorithm_overview(self, algorithm_name: str) -> Dict:
        return self.algorithm_contexts.get(algorithm_name, {})
    
    def get_complexity_explanation(self, complexity: Dict) -> str:
        return f"""
        Time Complexity:
        - Best Case: {complexity.get('best', 'N/A')}
        - Average Case: {complexity.get('average', 'N/A')}  
        - Worst Case: {complexity.get('worst', 'N/A')}
        
        Space Complexity: {complexity.get('space', 'N/A')}
        """