from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Skill

async def list_skills(db: AsyncSession):
    result = await db.execute(select(Skill))
    return result.scalars().all()