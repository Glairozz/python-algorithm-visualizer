from typing import Optional, Callable
from ..core.timeline import Timeline
from ..core.array_state import ArrayState
from .renderer import Renderer
from .controller import PlaybackController


class VisualizationEngine:
    def __init__(self, renderer: Renderer):
        self.renderer = renderer
        self.timeline: Optional[Timeline] = None
        self.controller = PlaybackController()
        self.on_state_change: Optional[Callable] = None
        self.on_step_change: Optional[Callable] = None
        self.on_complete: Optional[Callable] = None
        
        self.controller.on_position_change = self._on_position_change
        self.controller.on_playback_complete = self._on_playback_complete
    
    def load_timeline(self, timeline: Timeline):
        self.timeline = timeline
        self.controller.set_timeline(timeline)
        self.timeline.reset()
        self._update_visualization()
    
    def play(self):
        if self.timeline:
            self.controller.play()
    
    def pause(self):
        self.controller.pause()
    
    def step_forward(self):
        if self.timeline:
            self.controller.step_forward()
    
    def step_backward(self):
        if self.timeline:
            self.controller.step_backward()
    
    def reset(self):
        if self.timeline:
            self.controller.reset()
    
    def set_speed(self, speed: float):
        self.controller.set_speed(speed)
    
    def set_position(self, position: int):
        if self.timeline:
            self.controller.set_position(position)
    
    def _on_position_change(self, state: ArrayState, step):
        self._update_visualization()
        if self.on_state_change:
            self.on_state_change(state)
        if self.on_step_change:
            self.on_step_change(step)
    
    def _on_playback_complete(self):
        if self.on_complete:
            self.on_complete()
    
    def _update_visualization(self):
        if self.timeline and self.renderer:
            state = self.timeline.get_current_state()
            if state:
                self.renderer.render(state)