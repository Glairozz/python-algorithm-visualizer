import time
import threading
from typing import Optional, Callable
from ..core.timeline import Timeline
from ..core.array_state import ArrayState


class PlaybackController:
    def __init__(self):
        self.timeline: Optional[Timeline] = None
        self.is_playing = False
        self.speed = 1.0  # Multiplier for playback speed
        self.base_delay = 0.5  # Base delay in seconds
        self.playback_thread: Optional[threading.Thread] = None
        
        self.on_position_change: Optional[Callable[[ArrayState, object], None]] = None
        self.on_playback_complete: Optional[Callable[[], None]] = None
    
    def set_timeline(self, timeline: Timeline):
        self.timeline = timeline
        self.stop()
    
    def play(self):
        if self.timeline and not self.is_playing:
            self.is_playing = True
            self.playback_thread = threading.Thread(target=self._playback_loop)
            self.playback_thread.daemon = True
            self.playback_thread.start()
    
    def pause(self):
        self.is_playing = False
    
    def stop(self):
        self.is_playing = False
        if self.playback_thread:
            self.playback_thread.join(timeout=0.1)
            self.playback_thread = None
    
    def step_forward(self):
        if self.timeline:
            if self.timeline.step_forward():
                self._notify_position_change()
    
    def step_backward(self):
        if self.timeline:
            if self.timeline.step_backward():
                self._notify_position_change()
    
    def reset(self):
        self.stop()
        if self.timeline:
            self.timeline.reset()
            self._notify_position_change()
    
    def set_speed(self, speed: float):
        self.speed = max(0.1, min(5.0, speed))
    
    def set_position(self, position: int):
        if self.timeline:
            if self.timeline.set_position(position):
                self._notify_position_change()
    
    def _playback_loop(self):
        while self.is_playing and self.timeline:
            if not self.timeline.step_forward():
                self.is_playing = False
                if self.on_playback_complete:
                    self.on_playback_complete()
                break
            
            self._notify_position_change()
            time.sleep(self.base_delay / self.speed)
    
    def _notify_position_change(self):
        if self.timeline and self.on_position_change:
            state = self.timeline.get_current_state()
            step = self.timeline.get_current_step()
            if state is not None:
                self.on_position_change(state, step)