from enum import Enum

class ApplicationStatus(str, Enum):
    pending = "pending"
    reviewed = "reviewed"
    accepted = "accepted"
    rejected = "rejected"
