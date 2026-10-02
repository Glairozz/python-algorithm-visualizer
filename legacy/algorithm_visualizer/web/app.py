import random
from typing import List, Optional
from ..algorithms import BubbleSort, QuickSort, MergeSort
from ..visualization import VisualizationEngine
from ..visualization.renderer import ConsoleRenderer


class AlgorithmVisualizerApp:
    def __init__(self):
        self.algorithms = {
            'bubble': BubbleSort(),
            'quick': QuickSort(),
            'merge': MergeSort()
        }
        self.renderer = ConsoleRenderer()
        self.engine = VisualizationEngine(self.renderer)
        self.current_array: Optional[List] = None
        self.current_algorithm = None
        
        self.engine.on_step_change = self._on_step_change
        self.engine.on_complete = self._on_complete
    
    def run_console_demo(self):
        print("=== Premium Algorithm Visualizer ===")
        print("1. Bubble Sort")
        print("2. Quick Sort") 
        print("3. Merge Sort")
        
        choice = input("Select algorithm (1-3): ").strip()
        algorithm_map = {'1': 'bubble', '2': 'quick', '3': 'merge'}
        
        if choice not in algorithm_map:
            print("Invalid choice!")
            return
        
        algorithm_name = algorithm_map[choice]
        self.current_algorithm = self.algorithms[algorithm_name]
        
        size = input("Enter array size (5-20, default 10): ").strip()
        try:
            size = int(size) if size else 10
            size = max(5, min(20, size))
        except ValueError:
            size = 10
        
        self.current_array = [random.randint(1, 99) for _ in range(size)]
        
        print(f"\nOriginal array: {self.current_array}")
        print(f"Algorithm: {self.current_algorithm.name}")
        print(f"Description: {self.current_algorithm.description}")
        print(f"Complexity: {self.current_algorithm.complexity}")
        
        input("\nPress Enter to start visualization...")
        
        timeline = self.current_algorithm.execute(self.current_array)
        self.engine.load_timeline(timeline)
        
        self._run_interactive_mode()
    
    def _run_interactive_mode(self):
        print("\n=== Interactive Controls ===")
        print("Commands: play, pause, step, back, reset, speed <0.1-5.0>, quit")
        
        while True:
            command = input("\n> ").strip().lower()
            
            if command == 'play':
                self.engine.play()
                print("Playing...")
                
            elif command == 'pause':
                self.engine.pause()
                print("Paused")
                
            elif command == 'step':
                self.engine.step_forward()
                
            elif command == 'back':
                self.engine.step_backward()
                
            elif command == 'reset':
                self.engine.reset()
                print("Reset to beginning")
                
            elif command.startswith('speed'):
                try:
                    speed = float(command.split()[1])
                    self.engine.set_speed(speed)
                    print(f"Speed set to {speed}x")
                except (IndexError, ValueError):
                    print("Usage: speed <0.1-5.0>")
                    
            elif command == 'quit':
                break
                
            else:
                print("Unknown command")
    
    def _on_step_change(self, step):
        if step and hasattr(step, 'explanation'):
            print(f"\n\033[96mStep: {step.explanation}\033[0m")
    
    def _on_complete(self):
        print("\n\033[92mAlgorithm execution completed!\033[0m")