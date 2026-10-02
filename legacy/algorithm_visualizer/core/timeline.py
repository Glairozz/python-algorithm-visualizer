from typing import List, Optional
from .step import Step
from .array_state import ArrayState


class Timeline:
    def __init__(self, initial_array: List):
        self.initial_array = initial_array.copy()
        self.steps: List[Step] = []
        self.current_position = -1
        self.array_states: List[ArrayState] = []
        
        initial_state = ArrayState(values=self.initial_array.copy())
        self.array_states.append(initial_state)
    
    def add_step(self, step: Step):
        self.steps.append(step)
        
        current_state = self.array_states[-1].copy()
        new_values = current_state.apply_step(step, current_state.values)
        current_state.values = new_values
        current_state.update_state(step)
        
        self.array_states.append(current_state)
    
    def get_current_state(self) -> Optional[ArrayState]:
        if 0 <= self.current_position < len(self.array_states):
            return self.array_states[self.current_position].copy()
        return None
    
    def get_current_step(self) -> Optional[Step]:
        if 0 <= self.current_position < len(self.steps):
            return self.steps[self.current_position]
        return None
    
    def step_forward(self) -> bool:
        if self.current_position < len(self.steps) - 1:
            self.current_position += 1
            return True
        return False
    
    def step_backward(self) -> bool:
        if self.current_position > -1:
            self.current_position -= 1
            return True
        return False
    
    def reset(self):
        self.current_position = -1
    
    def set_position(self, position: int) -> bool:
        if -1 <= position < len(self.steps):
            self.current_position = position
            return True
        return False
    
    def get_total_steps(self) -> int:
        return len(self.steps)
    
    def get_progress(self) -> float:
        if len(self.steps) == 0:
            return 0.0
        return (self.current_position + 1) / len(self.steps)