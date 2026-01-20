from typing import List, Any, Optional
from dataclasses import dataclass, field
import copy


@dataclass
class ArrayState:
    values: List[Any]
    sorted_indices: List[int] = field(default_factory=list)
    highlighted_indices: List[int] = field(default_factory=list)
    pivot_index: Optional[int] = None
    comparing_indices: List[int] = field(default_factory=list)
    
    def copy(self) -> 'ArrayState':
        return ArrayState(
            values=self.values.copy(),
            sorted_indices=self.sorted_indices.copy(),
            highlighted_indices=self.highlighted_indices.copy(),
            pivot_index=self.pivot_index,
            comparing_indices=self.comparing_indices.copy()
        )
    
    def apply_step(self, step, current_values: List[Any]) -> List[Any]:
        new_values = current_values.copy()
        
        if step.type.value == "swap":
            idx1, idx2 = step.indices
            new_values[idx1], new_values[idx2] = new_values[idx2], new_values[idx1]
            
        elif step.type.value == "overwrite":
            idx = step.indices[0]
            new_values[idx] = step.values[0]
            
        return new_values
    
    def update_state(self, step):
        self.comparing_indices = []
        
        if step.type.value == "compare":
            self.comparing_indices = step.indices
            
        elif step.type.value == "mark_sorted":
            self.sorted_indices.extend(step.indices)
            
        elif step.type.value == "highlight":
            self.highlighted_indices = step.indices
            
        elif step.type.value == "clear_highlight":
            for idx in step.indices:
                if idx in self.highlighted_indices:
                    self.highlighted_indices.remove(idx)
                    
        elif step.type.value == "pivot":
            self.pivot_index = step.indices[0]