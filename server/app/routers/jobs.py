from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core import get_db
from app.schemas.job import JobRead, JobUpdate, JobListQuery, JobCreate
from app.services.jobs import list_jobs, get_job_by_id, delete_job_by_id, update_job_by_id, create_job
from app.schemas.common import Page, PageMeta
router = APIRouter()


@router.get("/", response_model=Page[JobRead])
async def get_all_jobs(
    q: JobListQuery = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_jobs(q, db)

    if not rows:
        raise HTTPException(status_code=404, detail="No jobs found")

    pages = (total + q.page_size - 1) // q.page_size 

    # Converted from sequence to list because page expects it !
    items: List[JobRead] = [JobRead.model_validate(r, from_attributes=True) for r in rows]

    return Page[JobRead](
        items=items,
        meta=PageMeta(
            page=q.page,
            page_size=q.page_size,
            total=total,
            pages=pages,
        ),
    )
@router.get('/{id}', response_model=JobRead)
async def get_job(id: int, db: AsyncSession = Depends(get_db)):
    job = await get_job_by_id(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not Found")
    return job

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(id: int, db: AsyncSession = Depends(get_db)):
    job = await delete_job_by_id(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)



@router.patch("/{id}", response_model=JobRead, status_code=status.HTTP_200_OK)
async def update_job(
    id: int,
    job_update: JobUpdate,
    db: AsyncSession = Depends(get_db),
):
    job = await update_job_by_id(db, id, job_update)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job



@router.post('/', response_model=JobRead, status_code= status.HTTP_200_OK)
async def create_new_job(job_create: JobCreate, db: AsyncSession = Depends(get_db)):
    job = await create_job(db, job_create)
    return job
    