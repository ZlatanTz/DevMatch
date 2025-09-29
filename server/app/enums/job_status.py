from enum import Enum


class JobStatus(str, Enum):
    open = "open"
    paused = "paused"
    closed = "closed"

