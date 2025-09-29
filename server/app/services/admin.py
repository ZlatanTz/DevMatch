from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User
from app.models.role import Role
from app.models.job import Job
from app.schemas.user import UserSuspendStatus


async def set_user_suspended_service(user_id: int, data: UserSuspendStatus, db: AsyncSession) -> User:
    result = await db.execute(
        select(User)
        .options(selectinload(User.role))
        .where(User.id == user_id)
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found")

    user.is_suspended = data.is_suspended
    await db.commit()
    await db.refresh(user)
    return user


async def list_users_service(db: AsyncSession) -> list[User]:
    result = await db.execute(
        select(User)
        .options(selectinload(User.role))
        .join(User.role)
        .where(Role.name != "admin")
    )
    return result.scalars().all()


async def get_all_jobs_admin_service(db: AsyncSession) -> list[Job]:
    result = await db.execute(
        select(Job).options(selectinload(Job.skills), selectinload(Job.employer))
    )
    return result.scalars().all()
