from .skill import SkillBase, SkillCreate, SkillRead
from .user import UserBase, UserCreate, UserUpdate, UserRead
from .candidate import CandidateBase, CandidateCreate, CandidateUpdate, CandidateRead
from .employer import EmployerBase, EmployerCreate, EmployerUpdate, EmployerRead
from .job import JobBase, JobCreate, JobUpdate, JobRead, JobReadDetailed
from .role import RoleBase, RoleCreate, RoleRead
from .application import ApplicationBase, ApplicationCreate, ApplicationOut, ApplicationUpdate, ApplicationStatus

__all__ = [
    # Skill
    "SkillBase", "SkillCreate", "SkillRead",

    # Role
    "RoleBase", "RoleCreate", "RoleRead",

    # User
    "UserBase", "UserCreate", "UserUpdate", "UserRead",

    # Candidate
    "CandidateBase", "CandidateCreate", "CandidateUpdate", "CandidateRead",

    # Employer
    "EmployerBase", "EmployerCreate", "EmployerUpdate", "EmployerRead",

    # Job
    "JobBase", "JobCreate", "JobUpdate", "JobRead", "JobReadDetailed",

    # Application
    "ApplicationBase", "ApplicationCreate", "ApplicationOut", "ApplicationUpdate", "ApplicationStatus"
]
