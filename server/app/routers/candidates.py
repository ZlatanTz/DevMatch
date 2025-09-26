from typing import List, Dict, Literal
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app import schemas, models
from app.services.candidates import list_candidates, get_candidate, candidate_update
from app.services import applications, recommendations
from app.utils.auth import require_roles
router = APIRouter()

@router.get("/", response_model=List[schemas.CandidateRead])
async def get_candidates(db: AsyncSession = Depends(get_db)):
    return await list_candidates(db)

@router.get("/{id}", response_model=schemas.CandidateRead)
async def get_candidate_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await get_candidate(id, db)

@router.put("/{id}", response_model=schemas.CandidateRead)
async def update_candidate_by_id(
    id: int,
    candidate_change: schemas.CandidateUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await candidate_update(id, candidate_change, db)

@router.get("/{candidate_id}/applications", response_model=List[schemas.ApplicationOut])
async def list_candidate_apps(candidate_id: int, db: AsyncSession = Depends(get_db)):
    return await applications.list_applications_for_candidate(db, candidate_id)



@router.get("/{candidate_id}/recommended-jobs", response_model=List[schemas.JobRecommendation])
async def list_recommended_jobs(
    candidate_id: int,
    min_score: float = Query(0.0, ge=0.0, le=1.0),
    limit: int = Query(20, ge=1, le=100),             

    # new filters
    sort_by: Literal["recommended", "created_at", "max_salary"] = Query("recommended"),
    sort_dir: Literal["asc", "desc"] = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),

    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("employer"))
):
    recs = await recommendations.recommend_jobs_for_candidate(db, candidate_id, limit=limit)
    recs = [r for r in recs if r.get("score", 0.0) >= min_score]
    if not recs:
        return []

    job_ids = [r["job_id"] for r in recs]
    rows = (
        await db.execute(select(models.Job).where(models.Job.id.in_(job_ids)))
    ).scalars().all()
    job_by_id: Dict[int, models.Job] = {j.id: j for j in rows}

    enriched = []
    for r in recs:
        job = job_by_id.get(r["job_id"])
        if not job:
            continue
        enriched.append({
            "job": job,
            "score": float(r["score"]),
            "parts": r.get("parts", {}),
            "reasons": r.get("reasons", []),
            "created_at": getattr(job, "created_at", None),
            "max_salary": getattr(job, "max_salary", None),
        })

    reverse = sort_dir == "desc"
    if sort_by == "recommended":
        enriched.sort(key=lambda x: (x["score"], x["created_at"]), reverse=reverse)
    elif sort_by == "created_at":
        enriched.sort(key=lambda x: (x["created_at"], x["score"]), reverse=reverse)
    elif sort_by == "max_salary":
        enriched.sort(key=lambda x: ((x["max_salary"] or 0), x["score"]), reverse=reverse)

    start = (page - 1) * page_size
    end = start + page_size
    slice_ = enriched[start:end]

    out: List[schemas.JobRecommendation] = [
        schemas.JobRecommendation(
            job=schemas.JobRead.model_validate(e["job"], from_attributes=True),
            score=e["score"],
            parts=e["parts"],
            reasons=e["reasons"],
        )
        for e in slice_
    ]
    return out
