# from .skill import Skill
# from .user import User, Admin
# from .associations import job_skills, candidate_skills
# from .candidate import Candidate
# from .employer import Employer
# from .job import Job

# __all__ = [
#     "Skill",
#     "User",
#     "Admin",
#     "Candidate",
#     "Employer",
#     "Job",
#     "job_skills",
#     "candidate_skills",
# ]


# app/schemas/__init__.py
from app.schemas.candidate import CandidateBase, CandidateCreate, CandidateUpdate, CandidateRead
from app.schemas.user import UserRead
