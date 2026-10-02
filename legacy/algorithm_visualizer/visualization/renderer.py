from abc import ABC, abstractmethod
from ..core.array_state import ArrayState


class Renderer(ABC):
    @abstractmethod
    def render(self, state: ArrayState):
        pass
    
    @abstractmethod
    def clear(self):
        pass


class ConsoleRenderer(Renderer):
    def render(self, state: ArrayState):
        print("\n" + "="*50)
        print("Array Visualization:")
        print("="*50)
        
        for i, value in enumerate(state.values):
            color_code = self._get_color_code(i, state)
            print(f"{color_code}[{value:2d}]\033[0m", end=" ")
        
        print("\n" + "="*50)
        print(f"Step: {len(state.values) - len(state.sorted_indices)} remaining")
        
    def clear(self):
        import os
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def _get_color_code(self, index: int, state: ArrayState) -> str:
        if index in state.sorted_indices:
            return "\033[92m"  # Green
        elif index == state.pivot_index:
            return "\033[93m"  # Yellow
        elif index in state.comparing_indices:
            return "\033[91m"  # Red
        elif index in state.highlighted_indices:
            return "\033[94m"  # Blue
        else:
            return "\033[37m"  # White