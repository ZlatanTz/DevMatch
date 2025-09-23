from sqlalchemy import select, func, exists
from sqlalchemy.sql import expression
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, selectinload
from typing import Tuple, List, Sequence

from app.models import Job, job_skills
from app.schemas.job import JobUpdate, JobListQuery, JobCreate


async def get_job_by_id(db: AsyncSession, id_ : int):
    return await db.get(Job, id_)


async def delete_job_by_id(db: AsyncSession, id_ : int):
    job = await db.get(Job, id_)
    if not job:
        return None
    await db.delete(job)
    await db.commit()
    return job



async def update_job_by_id(db: AsyncSession, id: int, job_update: JobUpdate):
    job = await db.get(Job, id)
    if not job:
        return None

    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    await db.commit()
    await db.refresh(job)
    return job

async def create_job(db: AsyncSession, job_create: JobCreate):
    job = Job(**job_create.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job
    

    

async def list_jobs(q: JobListQuery, db: AsyncSession) -> Tuple[Sequence[Job], int]:
    stmt = select(Job)

    if q.title_contains:
        stmt = stmt.where(Job.title.ilike(f"%{q.title_contains}%"))

    if q.is_remote is not None:
        stmt = stmt.where(Job.is_remote.is_(q.is_remote))

    if q.seniorities:
        stmt = stmt.where(Job.seniority.in_(q.seniorities))

    if q.skill_ids_any:
        skill_exists = exists(
            select(1)
            .select_from(job_skills)
            .where(
                job_skills.c.job_id == Job.id,
                job_skills.c.skill_id.in_(q.skill_ids_any),
            )
        )
        stmt = stmt.where(skill_exists)

    sort_map = {"created_at": Job.created_at, "max_salary": Job.max_salary}
    col = sort_map[q.sort_by]
    
    if q.sort_dir == "desc":
        stmt = stmt.order_by(col.desc().nullslast(), Job.id.desc())
    else:
        stmt = stmt.order_by(col.asc().nullsfirst(), Job.id.asc())

    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(total_stmt)).scalar_one()

    stmt = (
        stmt.options(selectinload(Job.skills))
        .offset((q.page - 1) * q.page_size)
        .limit(q.page_size)
    )

    rows = (await db.execute(stmt)).scalars().all()
    return rows, total
