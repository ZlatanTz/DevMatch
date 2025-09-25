from .skill import SkillBase, SkillCreate, SkillRead
from .user import UserBase, UserUpdate, UserRead
from .candidate import CandidateBase, CandidateCreate, CandidateUpdate, CandidateRead
from .employer import EmployerBase, EmployerRead, EmployerRegister
from .job import JobBase, JobCreate, JobUpdate, JobRead
from .role import RoleBase, RoleCreate, RoleRead

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
    "EmployerBase", "EmployerRead", "EmployerRegister"

    # Job
    "JobBase", "JobCreate", "JobUpdate", "JobRead",
]
