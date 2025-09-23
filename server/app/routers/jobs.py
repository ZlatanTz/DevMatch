<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas.job import JobRead, JobUpdate, JobListQuery
from app.services.jobs import list_jobs, get_job_by_id, delete_job_by_id, update_job_by_id

router = APIRouter()

@router.get("/", response_model=dict)
async def get_all_jobs(
    q: JobListQuery = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_jobs(q, db)
    if not rows:
        raise HTTPException(status_code=404, detail="No jobs found")

    return {
        "items": rows,   
        "total": total,
        "page": q.page,
        "page_size": q.page_size,
    }

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

=======
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import JobRead
from app.services.jobs import list_jobs

router = APIRouter()

@router.get("/", response_model=list[JobRead])
async def get_roles(db: AsyncSession = Depends(get_db)):
    return await list_jobs(db)

@router.get("/{id}", response_model=list[JobRead])
async def get_roles(id:int, db: AsyncSession = Depends(get_db)):
    return await list_jobs(db)
>>>>>>> ed3566c7234b1950c020b7133f96291b21147170

