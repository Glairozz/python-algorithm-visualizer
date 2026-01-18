from enum import Enum
from typing import List, Any, Optional
from dataclasses import dataclass


class StepType(Enum):
    COMPARE = "compare"
    SWAP = "swap"
    OVERWRITE = "overwrite"
    MARK_SORTED = "mark_sorted"
    HIGHLIGHT = "highlight"
    CLEAR_HIGHLIGHT = "clear_highlight"
    PIVOT = "pivot"
    MERGE = "merge"


@dataclass
class Step:
    type: StepType
    indices: List[int]
    values: Optional[List[Any]] = None
    explanation: str = ""
    metadata: Optional[dict] = None
    
    def __post_init__(self):
        if self.values is None:
            self.values = []
        if self.metadata is None:
            self.metadata = {}
    
    @classmethod
    def compare(cls, index1: int, index2: int, explanation: str = "") -> 'Step':
        return cls(
            type=StepType.COMPARE,
            indices=[index1, index2],
            explanation=explanation
        )
    
    @classmethod
    def swap(cls, index1: int, index2: int, explanation: str = "") -> 'Step':
        return cls(
            type=StepType.SWAP,
            indices=[index1, index2],
            explanation=explanation
        )
    
    @classmethod
    def overwrite(cls, index: int, value: Any, explanation: str = "") -> 'Step':
        return cls(
            type=StepType.OVERWRITE,
            indices=[index],
            values=[value],
            explanation=explanation
        )
    
    @classmethod
    def mark_sorted(cls, indices: List[int], explanation: str = "") -> 'Step':
        return cls(
            type=StepType.MARK_SORTED,
            indices=indices,
            explanation=explanation
        )
    
    @classmethod
    def highlight(cls, indices: List[int], explanation: str = "") -> 'Step':
        return cls(
            type=StepType.HIGHLIGHT,
            indices=indices,
            explanation=explanation
        )
    
    @classmethod
    def clear_highlight(cls, indices: List[int], explanation: str = "") -> 'Step':
        return cls(
            type=StepType.CLEAR_HIGHLIGHT,
            indices=indices,
            explanation=explanation
        )
    
    @classmethod
    def pivot(cls, index: int, explanation: str = "") -> 'Step':
        return cls(
            type=StepType.PIVOT,
            indices=[index],
            explanation=explanation
        )
    
    @classmethod
    def merge(cls, left_range: tuple, right_range: tuple, explanation: str = "") -> 'Step':
        return cls(
            type=StepType.MERGE,
            indices=list(range(left_range[0], right_range[1])),
            metadata={'left_range': left_range, 'right_range': right_range},
            explanation=explanation
        )