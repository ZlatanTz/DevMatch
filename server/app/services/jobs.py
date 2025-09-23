from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Job

async def list_jobs(db: AsyncSession):
    result = await db.execute(select(Job))
    return result.scalars().all()

async def get_job_by_id(id: int, db: AsyncSession):
    result = await db.execute(select(Job))
    return result.scalars().all()

