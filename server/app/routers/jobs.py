from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict
from sqlalchemy import select
from app.core import get_db
from app import schemas
from app import models
from app.services import jobs, applications, recommendations
from app.schemas import common, job

router = APIRouter()


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



@router.get("/{id}/ranked-applications", response_model=List[schemas.ApplicationRecommendation])
async def list_ranked_applications_for_job(
    id: int,
    limit: int = Query(20, ge=1, le=200),
    min_score: float = Query(0.0, ge=0.0, le=1.0),
    db: AsyncSession = Depends(get_db),
):

    recs = await recommendations.rank_applications_for_job(db, id, limit=limit)
    recs = [r for r in recs if r.get("score", 0.0) >= min_score]
    if not recs:
        return []


    cand_ids = [r["candidate_id"] for r in recs if r.get("candidate_id") is not None]
    rows = (await db.execute(select(models.Candidate).where(models.Candidate.id.in_(cand_ids)))).scalars().all()
    cand_by_id: Dict[int, models.Candidate] = {c.id: c for c in rows}

   
    out: List[schemas.ApplicationRecommendation] = []
    for r in recs:
        cid = r.get("candidate_id")
        if cid is None:
            continue
        candidate = cand_by_id.get(cid)
        if candidate is None:
            continue
        out.append(
            schemas.ApplicationRecommendation(
                application_id=r["application_id"],
                candidate=schemas.CandidateRead.model_validate(candidate, from_attributes=True),
                score=float(r["score"]),
                parts=r.get("parts", {}),
                reasons=r.get("reasons", []),
            )
        )
    return out
