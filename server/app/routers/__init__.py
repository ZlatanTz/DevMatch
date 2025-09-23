from .roles import router as roles_router
from .users import router as users_router
from .jobs import router as jobs_router
from .skills import router as skills_router
from .employers import router as employers_router
from .candidates import router as candidates_router


__all__ = ["roles_router", "users_router", "jobs_router", "skills_router","employers_router", "candidates_router"]

