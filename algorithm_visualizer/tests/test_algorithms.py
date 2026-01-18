import pytest
from ..algorithms import BubbleSort, QuickSort, MergeSort
from ..core.timeline import Timeline


class TestAlgorithmCorrectness:
    
    def test_bubble_sort_correctness(self):
        algorithm = BubbleSort()
        test_cases = [
            [64, 34, 25, 12, 22, 11, 90],
            [5, 2, 8, 1, 9],
            [1, 2, 3, 4, 5],
            [5, 4, 3, 2, 1],
            [1],
            []
        ]
        
        for test_array in test_cases:
            timeline = algorithm.execute(test_array)
            
            # Check final state is sorted
            final_state = timeline.array_states[-1]
            expected = sorted(test_array)
            assert final_state.values == expected
            
            # Check that initial state is preserved
            initial_state = timeline.array_states[0]
            assert initial_state.values == test_array
    
    def test_quick_sort_correctness(self):
        algorithm = QuickSort()
        test_cases = [
            [64, 34, 25, 12, 22, 11, 90],
            [5, 2, 8, 1, 9],
            [1, 2, 3, 4, 5],
            [5, 4, 3, 2, 1],
            [1],
            []
        ]
        
        for test_array in test_cases:
            timeline = algorithm.execute(test_array)
            
            # Check final state is sorted
            final_state = timeline.array_states[-1]
            expected = sorted(test_array)
            assert final_state.values == expected
    
    def test_merge_sort_correctness(self):
        algorithm = MergeSort()
        test_cases = [
            [64, 34, 25, 12, 22, 11, 90],
            [5, 2, 8, 1, 9],
            [1, 2, 3, 4, 5],
            [5, 4, 3, 2, 1],
            [1],
            []
        ]
        
        for test_array in test_cases:
            timeline = algorithm.execute(test_array)
            
            # Check final state is sorted
            final_state = timeline.array_states[-1]
            expected = sorted(test_array)
            assert final_state.values == expected
    
    def test_step_sequence_validity(self):
        algorithm = BubbleSort()
        test_array = [3, 1, 4, 1, 5]
        timeline = algorithm.execute(test_array)
        
        # Check that we have at least one step for non-trivial arrays
        assert len(timeline.steps) > 0 if len(test_array) > 1 else len(timeline.steps) == 0
        
        # Check that array states count equals steps + 1 (initial state)
        assert len(timeline.array_states) == len(timeline.steps) + 1
    
    def test_timeline_navigation(self):
        algorithm = QuickSort()
        test_array = [3, 2, 1]
        timeline = algorithm.execute(test_array)
        
        # Test reset
        timeline.reset()
        assert timeline.current_position == -1
        
        # Test step forward
        initial_steps = timeline.current_position
        timeline.step_forward()
        assert timeline.current_position == initial_steps + 1
        
        # Test step backward
        timeline.step_backward()
        assert timeline.current_position == initial_steps