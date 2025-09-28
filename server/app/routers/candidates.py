from typing import List, Dict, Literal, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app import schemas, models
from app.services.candidates import list_candidates, get_candidate, candidate_update
from app.services import applications, recommendations
from app.utils.auth import require_roles, get_current_user
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone

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



def _get_field(obj, name: str):
    if obj is None:
        return None
    if isinstance(obj, dict):
        return obj.get(name)
    return getattr(obj, name, None)

def _user_role_name(user) -> str | None:
    role = _get_field(user, "role")
    
    if role is None:
        return None
    
    if hasattr(role, "value"):
        try:
            return str(role.value)
        except Exception:
            pass
    
    name = _get_field(role, "name")
    if name is not None:
        return str(name)
    
    return str(role)

@router.get("/{candidate_id}/recommended-jobs", response_model=List[schemas.JobRecommendation])
async def list_recommended_jobs(
    candidate_id: int,
    min_score: float = Query(0.5, ge=0.0, le=1.0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: Literal["recommended", "created_at", "max_salary"] = Query("recommended"),
    sort_dir: Literal["asc", "desc"] = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    role_name = (_user_role_name(current_user) or "").lower()
    if role_name != "candidate":
        
        cand_exists = await db.scalar(
            select(models.Candidate.id).where(models.Candidate.user_id == _get_field(current_user, "id"))
        )
        if not cand_exists:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidates only")

    user_id = _get_field(current_user, "id")

    cand = await db.scalar(
        select(models.Candidate).where(models.Candidate.user_id == user_id)
    )
    if not cand:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate profile not found")
    if int(cand.id) != int(candidate_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your profile")

    recs = await recommendations.recommend_jobs_for_candidate(db, candidate_id, limit=limit)
    recs = [r for r in recs if float(r.get("score") or 0.0) >= min_score]
    if not recs:
        return []

    job_ids = [int(r["job_id"]) for r in recs if r.get("job_id") is not None]

    rows = (
        await db.execute(
            select(models.Job)
            .where(models.Job.id.in_(job_ids))
            .options(
                selectinload(models.Job.skills),
                selectinload(models.Job.employer),
            )
        )
    ).scalars().all()
    job_by_id = {j.id: j for j in rows}

    enriched: List[Dict[str, Any]] = []
    for r in recs:
        job = job_by_id.get(int(r["job_id"]))
        if not job:
            continue
        enriched.append({
            "job": job,
            "score": float(r["score"]),
            "parts": r.get("parts", {}) or {},
            "reasons": r.get("reasons", []) or [],
            "created_at": getattr(job, "created_at", None),
            "max_salary": getattr(job, "max_salary", None),
        })

    reverse = sort_dir == "desc"

    def safe_dt(dt: datetime | None) -> datetime:
        return dt or datetime.min.replace(tzinfo=timezone.utc)

    if sort_by == "recommended":
        enriched.sort(key=lambda x: (x["score"], safe_dt(x["created_at"])), reverse=reverse)
    elif sort_by == "created_at":
        enriched.sort(key=lambda x: (safe_dt(x["created_at"]), x["score"]), reverse=reverse)
    elif sort_by == "max_salary":
        enriched.sort(key=lambda x: ((x["max_salary"] or 0), x["score"]), reverse=reverse)

    start = (page - 1) * page_size
    end = start + page_size
    slice_ = enriched[start:end]

    return [
        schemas.JobRecommendation(
            job=schemas.JobReadDetailed.model_validate(e["job"], from_attributes=True),
            score=e["score"],
            parts=e["parts"],
            reasons=e["reasons"],
        )
        for e in slice_
    ]
