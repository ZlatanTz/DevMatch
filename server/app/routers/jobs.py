from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core import get_db
from app import schemas
from app.services import jobs, applications
from app.schemas import common, job

router = APIRouter()


@router.get("/detailed", response_model=common.Page[schemas.JobReadDetailed])
async def get_all_jobs_detailed(
    q: schemas.job.JobListQuery = Depends(schemas.job.job_list_query),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await jobs.list_jobs_with_employer(q, db)
    pages = (total + q.page_size - 1) // q.page_size
    items: List[schemas.JobReadDetailed] = [
        schemas.JobReadDetailed.model_validate(r, from_attributes=True) for r in rows
    ]
    return common.Page[schemas.JobReadDetailed](
        items=items,
        meta=common.PageMeta(
            page=q.page,
            page_size=q.page_size,
            total=total,
            pages=pages,
        ),
    )

@router.get("/{id}/detailed", response_model=schemas.JobReadDetailed)
async def get_job_detailed(id: int, db: AsyncSession = Depends(get_db)):
    job = await jobs.get_job_with_employer(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobReadDetailed.model_validate(job, from_attributes=True)


@router.get("/", response_model=common.Page[schemas.JobRead])
async def get_all_jobs(
    q: job.JobListQuery = Depends(job.job_list_query),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await jobs.list_jobs(q, db)

    pages = (total + q.page_size - 1) // q.page_size
    items: List[schemas.JobRead] = [
        schemas.JobRead.model_validate(r, from_attributes=True) for r in rows
    ]

    return common.Page[schemas.JobRead](
        items=items,  # will be [] if no rows
        meta=common.PageMeta(
            page=q.page,
            page_size=q.page_size,
            total=total,
            pages=pages,
        ),
    )

@router.get("/{id}", response_model=schemas.JobRead)
async def get_job(id: int, db: AsyncSession = Depends(get_db)):
    job = await jobs.get_job_by_id(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobRead.model_validate(job, from_attributes=True)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(id: int, db: AsyncSession = Depends(get_db)):
    deleted = await jobs.delete_job_by_id(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.JobRead, status_code=status.HTTP_200_OK)
async def update_job(
    id: int,
    job_update: schemas.JobUpdate,
    db: AsyncSession = Depends(get_db),
):
    job = await jobs.update_job_by_id(db, id, job_update)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobRead.model_validate(job, from_attributes=True)


@router.post("/", response_model=schemas.JobRead, status_code=status.HTTP_201_CREATED)
async def create_new_job(
    job_create: schemas.JobCreate,
    db: AsyncSession = Depends(get_db),
):
    job = await jobs.create_job(db, job_create)
    return schemas.JobRead.model_validate(job, from_attributes=True)


@router.post("/{id}/apply", response_model=schemas.ApplicationOut)
async def apply_to_job(
    id: int,
    payload: schemas.ApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    return await applications.create_application(db, payload, id)


@router.get("/{id}/applications", response_model=List[schemas.ApplicationOut])
async def list_job_apps(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    return await applications.list_applications_for_job(db, id)


