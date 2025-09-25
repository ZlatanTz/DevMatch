from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Employer
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.users import get_user
from fastapi import HTTPException


async def list_employers(db: AsyncSession):
    result = await db.execute(
        select(Employer)
    )
    return result.scalars().all()

async def get_employer(id: int, db: AsyncSession):

    user = await get_user(id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")


    result = await db.execute(select(Employer).where(Employer.user_id == user.id))
    employer = result.scalars().first()
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found for this user")

    return employer