from typing import Tuple, List, Sequence, Iterable
from fastapi import HTTPException
from sqlalchemy import select, func, exists
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Job, job_skills, Skill, Employer
from app.schemas.job import JobUpdate, JobListQuery, JobCreate
from app.enums.job_status import JobStatus


async def get_job_by_id(db: AsyncSession, id_: int):
    return await db.get(Job, id_)


async def delete_job_by_id(db: AsyncSession, id_: int):
    job = await db.get(Job, id_)
    if not job:
        return None
    await db.delete(job)
    await db.commit()
    return job


async def create_job(db: AsyncSession, job_create: JobCreate):
    # require a real employer_id
    row = await db.execute(select(Employer.id).where(Employer.id == job_create.employer_id))
    if row.scalar_one_or_none() is None:
        raise HTTPException(status_code=400, detail="Invalid employer_id: not found")

    # build Job without relationship IDs
    data = job_create.model_dump(exclude_unset=True, exclude={"skills"})
    job = Job(**data)

    job.status = JobStatus.open.value


    if job_create.skills:
        job.skills = await _fetch_skills_or_400(db, job_create.skills)

    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


async def update_job_by_id(db: AsyncSession, id: int, job_update: JobUpdate):
    job = await db.get(Job, id)
    if not job:
        return None

    payload = job_update.model_dump(exclude_unset=True)
    skills_ids = payload.pop("skills", None)  # None = no change, [] = clear

    for field, value in payload.items():
        setattr(job, field, value)

    if skills_ids is not None:
        job.skills = await _fetch_skills_or_400(db, skills_ids)

    await db.commit()
    await db.refresh(job)
    return job


async def _fetch_skills_or_400(db: AsyncSession, ids: Iterable[int]) -> List[Skill]:
    ids = [int(x) for x in set(ids)]
    if not ids:
        return []
    res = await db.execute(select(Skill).where(Skill.id.in_(ids)))
    skills = list(res.scalars().all())
    missing = sorted(set(ids) - {s.id for s in skills})
    if missing:
        raise HTTPException(status_code=400, detail=f"Unknown skill ids: {missing}")
    return skills


async def list_jobs(q: JobListQuery, db: AsyncSession) -> Tuple[Sequence[Job], int]:
    stmt = select(Job).where(Job.status == JobStatus.open.value)

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
    stmt = (
        stmt.order_by(col.desc().nullslast(), Job.id.desc())
        if q.sort_dir == "desc"
        else stmt.order_by(col.asc().nullsfirst(), Job.id.asc())
    )

    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(total_stmt)).scalar_one()

    stmt = (
        stmt.options(selectinload(Job.skills))
        .offset((q.page - 1) * q.page_size)
        .limit(q.page_size)
    )

    rows = (await db.execute(stmt)).scalars().all()
    return rows, total


async def list_jobs_with_employer(q, db):
    stmt = (
        select(Job)
        .where(Job.status == JobStatus.open.value)
        .options(selectinload(Job.employer))
    )

    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(total_stmt)).scalar_one()

    rows = (
        await db.execute(stmt.offset((q.page-1)*q.page_size).limit(q.page_size))
    ).scalars().all()
    return rows, total

async def get_job_with_employer(db, job_id: int):
    stmt = select(Job).options(selectinload(Job.employer)).where(Job.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()
    return job


async def list_jobs_by_employer_id(
    db: AsyncSession,
    employer_id: int,
    page: int = 1,
    page_size: int = 20,
):
    stmt = select(Job).where(Job.employer_id == employer_id)

    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(total_stmt)).scalar_one()

    stmt = (
        stmt.options(selectinload(Job.skills))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    rows = (await db.execute(stmt)).scalars().all()
    return rows, total
