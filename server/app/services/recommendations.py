from dataclasses import dataclass
from typing import Dict, List, Optional, Set
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Job, Candidate, Skill, Application, job_skills
from sqlalchemy import select, func, exists
from sqlalchemy.orm import selectinload
from app.schemas.job import JobListQuery


SENIORITY_RANK = {
  'intern': 0,
  'junior': 1,
  'medior': 2,
  'senior': 3,
}

@dataclass
class ScoreBreakdown:
  total: float
  parts: Dict[str, float]
  reasons: List[str]



DEFAULT_WEIGHTS = {
  'seniority': 0.3,
  'location': 0.1,
  'skills': 0.4,
  'salary': 0.2
}

# Normalizing, ex: _norm(5, 0, 10) -> 0.5
def _norm(x: float, lo: float = 0, hi: float = 1):
    if hi <= lo:
        return 0.0
    return max(0.0, min(1.0, (x - lo) / (hi - lo)))


# Check string similiarity
def _jaccard(a: set[str], b: set[str]):
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


def _seniority_rank(s: Optional[str]) -> Optional[int]:
    if not s:
        return None
    return SENIORITY_RANK.get(s.lower())


def _denom(v: Optional[int]) -> int:
    # Always return a positive int denominator, even if v is None or 0,
    return 1 if v is None or v <= 0 else v

def _salary_match(
    desired: Optional[int],
    min_salary: Optional[int],
    max_salary: Optional[int],
):
    if desired is None or (min_salary is None and max_salary is None):
        return 0.5, "Salary info incomplete, neutral score"

    if min_salary is not None and desired < min_salary:
        gap = min_salary - desired
        denom = _denom(min_salary)
        score = max(0.0, 1.0 - _norm(gap, 0, denom))
        return score, f"Desired {desired} below min {min_salary}"

    if max_salary is not None and desired > max_salary:
        gap = desired - max_salary
        denom = _denom(max_salary)
        score = max(0.0, 1.0 - _norm(gap, 0, denom))
        return score, f"Desired {desired} above max {max_salary}"

    return 1.0, f"Desired {desired} within range {min_salary} - {max_salary}"


def _location_match(is_remote: bool, cand_remote_pref: Optional[bool] = None):
    if is_remote:
        return 1.0, 'Location flexible'
    if cand_remote_pref is None:
        return 0.5, ''
    if cand_remote_pref is False:
        return 1.0, 'Job is on-site'
    return 0.2, ''


def _skills_match(cand_skills: Optional[List[str]], job_skills: Optional[List[str]]):
    cand_set: Set[str] = {skill.strip().lower() for skill in (cand_skills or []) if skill}
    job_set: Set[str] = {skill.strip().lower() for skill in (job_skills or []) if skill}

    if not job_set:
        return 0.5, 'job listed no skills'
    if not cand_set:
        return 0.0, 'candidate listed no skills'
    
    score = _jaccard(cand_set, job_set)
    overlap = sorted(cand_set & job_set)
    missing = sorted(job_set - cand_set)

    ov_txt = ", ".join(overlap) if overlap else "none"
    miss_txt = ", ".join(missing[:5]) + ("…" if len(missing) > 5 else "")
    reason = f"Skills overlap {round(100 * score)}% (Matched: {ov_txt.capitalize()})"
    return score, reason


def _seniority_match(candidate_seniority: Optional[str], job_seniority: Optional[str]):
    cr, jr = _seniority_rank(candidate_seniority), _seniority_rank(job_seniority)
    if cr is None or jr is None:
        return 0.5, ''
    if cr == jr:
        return 1.0, f"Seniority matches"
    diff = abs(cr - jr)
    if diff == 1:
        return 0.8, f'Close seniority'
    return max(0.0, 1.0 - 0.4 * diff), f'seniority gap {candidate_seniority} vs {job_seniority}'



def _score(
     *, # must specify
    cand_skills: Optional[List[str]],
    job_skills: Optional[List[str]],
    is_remote: bool,
    cand_remote_pref: Optional[bool],
    desired_salary: Optional[int],
    min_salary: Optional[int],
    max_salary: Optional[int],
    cand_seniority: Optional[str],
    job_seniority: Optional[str],
    weights: Dict[str, float] = DEFAULT_WEIGHTS,
):
    parts: Dict[str, float] = {}
    reasons: List[str] = []
    skills_score, skills_reason = _skills_match(cand_skills, job_skills)
    parts['skills'] = skills_score
    reasons.append(skills_reason)

    loc_score, loc_reason = _location_match(is_remote, cand_remote_pref)
    parts['location'] = loc_score
    reasons.append(loc_reason)

    sen_score, sen_reason = _seniority_match(cand_seniority, job_seniority)
    parts['seniority'] = sen_score
    reasons.append(sen_reason)

    pay_score, pay_reason = _salary_match(desired_salary, min_salary, max_salary)
    parts['salary'] = pay_score
    reasons.append(pay_reason)

    total = sum(weights[name] * parts.get(name, 0.0) for name in weights)
    return ScoreBreakdown(total=round(total, 4), parts=parts, reasons=reasons)

    

def _collect_skill_names(skills) -> List[str]:
    return [s.name.strip().lower() for s in (skills or []) if getattr(s, "name", None)]


async def rank_applications_for_job(db: AsyncSession, job_id: int, limit: int = 20):
    job: Optional[Job] = await db.get(Job, job_id)
    if not job:
      return []
    try:
        await db.refresh(job, attribute_names=["skills"])
    except Exception:
        pass
    

    job_skill_names = _collect_skill_names(getattr(job, 'skills', []))

    apps = (
        await db.execute(
            select(Application)
            .where(Application.job_id == job_id)
            .options(selectinload(Application.candidate).selectinload(Candidate.skills))
        )
    ).scalars().all()

    results: List[dict] = []

    for app in apps:
      cand: Optional[Candidate] = app.candidate

      cand_skills_list: List[str]

      if cand is not None and hasattr(cand, 'skills'):
          cand_skills_list = _collect_skill_names(getattr(cand, 'skills', []))
      else:
          cand_skills_list = _collect_skill_names(getattr(app, "skills", []))

    sb = _score(
        cand_skills=cand_skills_list,
        job_skills=job_skill_names,
        is_remote=bool(getattr(job, "is_remote", False)),
        cand_remote_pref=getattr(cand, "prefers_remote", None),  
        desired_salary=getattr(cand, "desired_salary", None),
        min_salary=getattr(job, "min_salary", None),
        max_salary=getattr(job, "max_salary", None),
        cand_seniority=getattr(cand, "seniority", None),      # 
        job_seniority=getattr(job, "seniority", None),
      )
    
    results.append({
        'application_id': app.id,
        'candidate_id': getattr(app, 'candidate_id', None),
        'score': sb.total,
        'parts': sb.parts,
        'reasons': sb.reasons
    })
    results.sort(key= lambda s: s['score'], reverse = True)
    return results[:limit]


async def recommend_jobs_for_candidate(db: AsyncSession, candidate_id: int, limit: int = 20):
    cand: Optional[Candidate] = await db.get(Candidate, candidate_id)
    if not cand:
        return []

    try:
        await db.refresh(cand, attribute_names=["skills"])
    except Exception:
        pass

    cand_skill_names = _collect_skill_names(getattr(cand, "skills", []))

    jobs = (
        await db.execute(
            select(Job)
            .where(Job.status == "open")
            .options(selectinload(Job.skills))
        )
    ).scalars().all()

    results: List[dict] = []
    for job in jobs:
        job_skill_names = _collect_skill_names(getattr(job, "skills", []))

        sb = _score(
            cand_skills=cand_skill_names,
            job_skills=job_skill_names,
            is_remote=bool(getattr(job, "is_remote", False)),
            cand_remote_pref=getattr(cand, "prefers_remote", None),
            desired_salary=getattr(cand, "desired_salary", None),
            min_salary=getattr(job, "min_salary", None),
            max_salary=getattr(job, "max_salary", None),
            cand_seniority=getattr(cand, "seniority", None),
            job_seniority=getattr(job, "seniority", None),
        )

        results.append({
            "job_id": job.id,
            "score": sb.total,
            "parts": sb.parts,
            "reasons": sb.reasons,
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:limit]


async def recommend_jobs_for_candidate_filtered(
    db: AsyncSession,
    candidate_id: int,
    q: JobListQuery,
    min_score: float = 0.0,
) -> List[dict]:
    cand: Candidate | None = await db.get(Candidate, candidate_id)
    if not cand:
        return []

    try:
        await db.refresh(cand, attribute_names=["skills"])
    except Exception:
        pass

    cand_skill_names = _collect_skill_names(getattr(cand, "skills", []))

    stmt = select(Job).where(Job.status == "open")

    if q.title_contains:
        stmt = stmt.where(func.lower(Job.title).ilike(f"%{q.title_contains.lower()}%"))

    if q.is_remote is not None:
        stmt = stmt.where(Job.is_remote.is_(q.is_remote))

    if q.seniorities:
        stmt = stmt.where(func.lower(Job.seniority).in_([s.lower() for s in q.seniorities]))

    if q.skill_ids_any:
        stmt = stmt.where(
            exists(
                select(1)
                .select_from(job_skills)
                .where(
                    job_skills.c.job_id == Job.id,
                    job_skills.c.skill_id.in_(q.skill_ids_any),
                )
            )
        )

    stmt = stmt.options(selectinload(Job.skills))

    jobs = (await db.execute(stmt)).scalars().all()
    if not jobs:
        return []

    recs: List[dict] = []
    for job in jobs:
        job_skill_names = _collect_skill_names(getattr(job, "skills", []))
        sb = _score(
            cand_skills=cand_skill_names,
            job_skills=job_skill_names,
            is_remote=bool(job.is_remote),
            cand_remote_pref=getattr(cand, "prefers_remote", None),
            desired_salary=getattr(cand, "desired_salary", None),
            min_salary=job.min_salary,
            max_salary=job.max_salary,
            cand_seniority=getattr(cand, "seniority", None),
            job_seniority=job.seniority,
        )
        if sb.total >= min_score:
            recs.append({
                "job": job,
                "job_id": job.id,
                "score": sb.total,
                "parts": sb.parts,
                "reasons": sb.reasons,
                "created_at": job.created_at,
                "max_salary": job.max_salary,
            })

    return recs