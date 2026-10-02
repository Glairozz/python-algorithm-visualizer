from abc import ABC, abstractmethod
from typing import List, Any
from ..core.timeline import Timeline


class BaseAlgorithm(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.complexity = {
            'best': '',
            'average': '',
            'worst': '',
            'space': ''
        }
    
    @abstractmethod
    def execute(self, array: List[Any]) -> Timeline:
        pass
    
    def get_info(self) -> dict:
        return {
            'name': self.name,
            'description': self.description,
            'complexity': self.complexity
        }