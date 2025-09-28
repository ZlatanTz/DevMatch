from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Iterable, Optional, List, Dict, Set, Mapping
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.core import get_db
from app import schemas
from app import models
from app.services import jobs, applications, recommendations
from app.schemas import common, job
from app.utils.auth import require_roles

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

@router.get("/detailed/", response_model=common.Page[schemas.JobReadDetailed])
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

@router.get("/{id}", response_model=schemas.JobRead)
async def get_job(id: int, db: AsyncSession = Depends(get_db)):
    job = await jobs.get_job_by_id(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobRead.model_validate(job, from_attributes=True)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(id: int, db: AsyncSession = Depends(get_db), current_user = Depends(require_roles("employer"))):
    deleted = await jobs.delete_job_by_id(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/{id}", response_model=schemas.JobRead, status_code=status.HTTP_200_OK)
async def update_job(
    id: int,
    job_update: schemas.JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("employer"))
):
    job = await jobs.update_job_by_id(db, id, job_update)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobRead.model_validate(job, from_attributes=True)

@router.post("/", response_model=schemas.JobRead, status_code=status.HTTP_201_CREATED)
async def create_new_job(
    job_create: schemas.JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("employer"))
):
    job = await jobs.create_job(db, job_create)
    return schemas.JobRead.model_validate(job, from_attributes=True)

@router.post("/{id}/apply/", response_model=schemas.ApplicationOut)
async def apply_to_job(
    id: int,
    payload: schemas.ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("candidate"))
):
    return await applications.create_application(db, payload, id, current_user.id)

@router.get("/{id}/detailed/", response_model=schemas.JobReadDetailed)
async def get_job_detailed(id: int, db: AsyncSession = Depends(get_db)):
    job = await jobs.get_job_with_employer(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobReadDetailed.model_validate(job, from_attributes=True)


@router.get("/{id}/applications/", response_model=List[schemas.ApplicationOut])
async def list_job_apps(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("employer"))
):
    return await applications.list_applications_for_job(db, id)





def collect_skill_names(skills: Optional[Iterable[Any]]) -> List[str]:
    out: List[str] = []
    for s in skills or []:
        if s is None:
            continue
        if hasattr(s, "name"):         
            name = getattr(s, "name", "")
        elif isinstance(s, str):       
            name = s
        elif isinstance(s, dict):      
            name = s.get("name", "")
        else:
            continue
        if name:
            out.append(name.strip().lower())
    return out


@router.get("/{id}/ranked-applications", response_model=List[schemas.ApplicationRecommendation])
async def list_ranked_applications_for_job(
    id: int,
    limit: int = Query(20, ge=1, le=200),
    min_score: float = Query(0.0, ge=0.0, le=1.0),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_roles("employer")),
):
    employer = await db.scalar(
        select(models.Employer).where(models.Employer.user_id == current_user.id)
    )
    if not employer:
        raise HTTPException(status_code=400, detail="employer profile not found")

    job = await db.scalar(select(models.Job).where(models.Job.id == id))
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    if job.employer_id != employer.id:
        raise HTTPException(status_code=403, detail="not authorized for this job")

    
    recs_raw: List[Mapping[str, Any]] = await recommendations.rank_applications_for_job(db, id, limit=limit) # type: ignore

    
    def to_int(x: Any) -> Optional[int]:
        if isinstance(x, int):
            return x
        if isinstance(x, str) and x.isdigit():
            return int(x)
        return None

    recs: List[Dict[str, Any]] = []
    for r in recs_raw:
        try:
            score = float(r.get("score", 0.0))
        except (TypeError, ValueError):
            continue
        if score < min_score:
            continue

        app_id = to_int(r.get("application_id"))
        cand_id = to_int(r.get("candidate_id"))
        if app_id is None or cand_id is None:
            continue

        recs.append({
            "application_id": app_id,
            "candidate_id": cand_id,
            "score": score,
            "parts": r.get("parts", {}) or {},
            "reasons": r.get("reasons", []) or [],
        })

    if not recs:
        return []

    
    app_ids = [r["application_id"] for r in recs]
    valid_app_ids: Set[int] = set(
        (await db.execute(
            select(models.Application.id).where(
                models.Application.id.in_(app_ids),
                models.Application.job_id == id,
            )
        )).scalars().all()
    )
    recs = [r for r in recs if r["application_id"] in valid_app_ids]
    if not recs:
        return []


    candidates = (await db.execute(
        select(models.Candidate)
        .options(selectinload(models.Candidate.skills))
        .where(models.Candidate.id.in_([r["candidate_id"] for r in recs]))
    )).scalars().all()
    cand_by_id: Dict[int, models.Candidate] = {c.id: c for c in candidates}


    out: List[schemas.ApplicationRecommendation] = []
    for r in recs:
        candidate = cand_by_id.get(r["candidate_id"])
        if not candidate:
            continue
        out.append(
            schemas.ApplicationRecommendation(
                application_id=r["application_id"],
                candidate=schemas.CandidateRead.model_validate(candidate, from_attributes=True),
                score=r["score"],
                parts=r["parts"],
                reasons=r["reasons"],
            )
        )
    return out


@router.get("/by-employer/{employer_id}", response_model=common.Page[schemas.JobRead])
async def get_jobs_by_employer(
    employer_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await jobs.list_jobs_by_employer_id(db, employer_id, page, page_size)

    pages = (total + page_size - 1) // page_size
    items: List[schemas.JobRead] = [
        schemas.JobRead.model_validate(r, from_attributes=True) for r in rows
    ]

    return common.Page[schemas.JobRead](
        items=items,
        meta=common.PageMeta(
            page=page,
            page_size=page_size,
            total=total,
            pages=pages,
        ),
    )
