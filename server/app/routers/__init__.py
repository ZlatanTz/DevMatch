from .roles import router as roles_router
from .users import router as users_router
from .jobs import router as jobs_router
from .skills import router as skills_router
from .employers import router as employers_router
from .candidates import router as candidates_router
from .auth import router as auth_router
from .applications import router as applications_router
from .me import router as me_router
from .admin import router as admin_router

__all__ = ["roles_router", "users_router", "jobs_router", "skills_router","employers_router", "candidates_router", "applications_router", "auth_router", "me_router", "admin_router"]


