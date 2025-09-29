from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.utils.auth import require_roles
from app.models.user import User
from app.schemas.user import UserRead, UserSuspendStatus
from app.schemas.job import JobRead

from app.services.admin import (
    set_user_suspended_service,
    list_users_service,
    get_all_jobs_admin_service,
)

router = APIRouter(prefix="", tags=["admin"])


@router.put("/suspend/{user_id}", response_model=UserRead)
async def set_user_suspended(
    user_id: int,
    data: UserSuspendStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    return await set_user_suspended_service(user_id, data, db)


@router.get("/all-users", response_model=list[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    return await list_users_service(db)


@router.get("/all-jobs", response_model=list[JobRead])
async def get_all_jobs_admin(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    return await get_all_jobs_admin_service(db)
