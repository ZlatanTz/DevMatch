from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Role

async def list_roles(db: AsyncSession):
    result = await db.execute(select(Role))
    return result.scalars().all()