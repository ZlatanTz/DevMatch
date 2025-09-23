from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import User
from sqlalchemy.ext.asyncio import AsyncSession

async def list_users(db: AsyncSession):
    result = await db.execute(
        select(User).options(selectinload(User.role))
    )
    return result.scalars().all()