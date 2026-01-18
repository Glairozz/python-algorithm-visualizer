import pytest
from ..core.step import Step, StepType
from ..core.array_state import ArrayState
from ..core.timeline import Timeline


class TestCoreComponents:
    
    def test_step_creation(self):
        # Test compare step
        step = Step.compare(0, 1, "Test comparison")
        assert step.type == StepType.COMPARE
        assert step.indices == [0, 1]
        assert step.explanation == "Test comparison"
        
        # Test swap step
        step = Step.swap(2, 3, "Test swap")
        assert step.type == StepType.SWAP
        assert step.indices == [2, 3]
        
        # Test overwrite step
        step = Step.overwrite(4, 10, "Test overwrite")
        assert step.type == StepType.OVERWRITE
        assert step.indices == [4]
        assert step.values == [10]
    
    def test_array_state_copy(self):
        state = ArrayState(
            values=[1, 2, 3],
            sorted_indices=[0],
            highlighted_indices=[1, 2],
            pivot_index=1
        )
        
        copied_state = state.copy()
        copied_state.values[0] = 99
        copied_state.sorted_indices.append(99)
        
        assert state.values[0] == 1  # Original unchanged
        assert 99 not in state.sorted_indices  # Original unchanged
    
    def test_array_state_apply_step(self):
        state = ArrayState(values=[3, 1, 2])
        
        # Test swap
        swap_step = Step.swap(0, 1)
        new_values = state.apply_step(swap_step, state.values)
        assert new_values == [1, 3, 2]
        
        # Test overwrite
        overwrite_step = Step.overwrite(2, 10)
        new_values = state.apply_step(overwrite_step, new_values)
        assert new_values == [1, 3, 10]
    
    def test_timeline_basic_functionality(self):
        initial_array = [3, 1, 2]
        timeline = Timeline(initial_array)
        
        assert timeline.initial_array == initial_array
        assert timeline.current_position == -1
        assert len(timeline.array_states) == 1
        assert len(timeline.steps) == 0
    
    def test_timeline_add_step(self):
        initial_array = [3, 1, 2]
        timeline = Timeline(initial_array)
        
        step = Step.swap(0, 1)
        timeline.add_step(step)
        
        assert len(timeline.steps) == 1
        assert len(timeline.array_states) == 2
        
        # Check that the swap was applied
        new_state = timeline.array_states[-1]
        assert new_state.values == [1, 3, 2]
    
    def test_timeline_navigation(self):
        initial_array = [3, 1, 2]
        timeline = Timeline(initial_array)
        
        # Add some steps
        timeline.add_step(Step.swap(0, 1))
        timeline.add_step(Step.swap(1, 2))
        
        # Test stepping forward
        assert timeline.step_forward() == True
        assert timeline.current_position == 0
        
        assert timeline.step_forward() == True
        assert timeline.current_position == 1
        
        # Test that we can't step beyond the end
        assert timeline.step_forward() == False
        
        # Test stepping backward
        assert timeline.step_backward() == True
        assert timeline.current_position == 0
        
        # Test reset
        timeline.reset()
        assert timeline.current_position == -1
    
    def test_timeline_progress(self):
        initial_array = [3, 1, 2]
        timeline = Timeline(initial_array)
        
        # Add steps
        for i in range(5):
            timeline.add_step(Step.compare(i % 3, (i + 1) % 3))
        
        # Test progress calculation
        timeline.set_position(2)
        assert timeline.get_progress() == 3.0 / 5.0
        
        timeline.set_position(-1)
        assert timeline.get_progress() == 0.0
        
        timeline.set_position(4)
        assert timeline.get_progress() == 1.0