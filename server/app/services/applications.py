
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from fastapi import HTTPException, applications


from app import models, schemas
from app.enums.application_status import ApplicationStatus
from app.enums.job_status import JobStatus



# services/applications.py
from sqlalchemy import select, and_
from fastapi import HTTPException

async def create_application(
    db: AsyncSession,
    application_data: schemas.ApplicationCreate,
    job_id: int,
    user_id: int,
):
    job = await db.scalar(select(models.Job).where(models.Job.id == job_id))
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    if job.status != JobStatus.open.value:
        raise HTTPException(status_code=400, detail="job is not open for applications")

 
    candidate = await db.scalar(
        select(models.Candidate).where(models.Candidate.user_id == user_id)
    )
    if not candidate:
        raise HTTPException(status_code=400, detail="candidate profile not found")

    candidate_id = candidate.id

    dup = await db.scalar(
        select(models.Application.id).where(
            and_(
                models.Application.job_id == job_id,
                models.Application.candidate_id == candidate_id,
            )
        )
    )
    if dup:
        raise HTTPException(status_code=400, detail="already applied to this job")

    db_app = models.Application(
        **application_data.model_dump(
            exclude={"candidate_id", "job_id", "skills"}, exclude_none=True
        ),
        job_id=job_id,
        candidate_id=candidate_id,
        skills=application_data.skills or [], 
    )

    db.add(db_app)
    await db.commit()
    await db.refresh(db_app)
    return db_app


async def list_applications_for_job(db: AsyncSession, job_id:int):
  job_stmt = select(models.Job).where(models.Job.id == job_id)
  job = (await db.execute(job_stmt)).scalar_one_or_none()
  if not job:
      raise HTTPException(status_code=404, detail="job not found")
  stmt = select(models.Application).where(models.Application.job_id == job_id).order_by(models.Application.created_at.desc())
  result = await db.execute(stmt)
  return result.scalars().all()



async def list_applications_for_candidate(db: AsyncSession, candidate_id:int):
  stmt = select(models.Application).where(models.Application.candidate_id == candidate_id).order_by(models.Application.created_at.desc())
  result = await db.execute(stmt)
  return result.scalars().all()


async def get_application(db: AsyncSession, application_id: int):
  stmt = select(models.Application).where(models.Application.id == application_id)
  app = (await db.execute(stmt)).scalar_one_or_none()
  if not app:
    raise HTTPException(status_code=404, detail="application not found")
  return app


async def update_application_status(db: AsyncSession, application_id: int, status: ApplicationStatus):
  stmt = select(models.Application).where(models.Application.id == application_id)
  db_app = (await db.execute(stmt)).scalar_one_or_none()
  if not db_app:
   raise HTTPException(status_code=404, detail="application not found")
  db_app.status = status
  await db.commit()
  await db.refresh(db_app)
  return db_app
