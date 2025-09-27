from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Candidate, User, Role, Skill
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Candidate, User, Role, Skill
from app.schemas.candidate import CandidateUpdate, CandidateRead
from ..services.users import get_user
async def list_candidates(db: AsyncSession) -> List[CandidateRead]:
    # include skills to serialize into SkillRead
    result = await db.execute(
        select(Candidate, User.email, Role.name)
        .join(User, Candidate.user_id == User.id)
        .join(Role, User.role_id == Role.id)
        .options(selectinload(Candidate.skills))
    )
    items: List[CandidateRead] = []
    for candidate, email, role_name in result.all():
        items.append(
            CandidateRead(
                id=candidate.id,
                user_id=candidate.user_id,
                first_name=candidate.first_name,
                last_name=candidate.last_name,
                location=candidate.location,
                years_exp=candidate.years_exp,
                bio=candidate.bio,
                resume_url=candidate.resume_url,
                desired_salary=candidate.desired_salary,
                country=getattr(candidate, "country", None),
                tel=getattr(candidate, "tel", None),
                img_path=getattr(candidate, "img_path", None),
                prefers_remote=getattr(candidate, "prefers_remote", None),
                seniority=getattr(candidate, "seniority", None),
                email=email,
                role=role_name,
                skills=candidate.skills,  
            )
        )
    return items

async def get_candidate(user_id: int, db: AsyncSession) -> CandidateRead:
    result = await db.execute(
        select(Candidate, User.email, Role.name)
        .join(User, Candidate.user_id == User.id)
        .join(Role, User.role_id == Role.id)
        .where(Candidate.user_id == user_id)
        .options(selectinload(Candidate.skills))
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate, email, role_name = row
    return CandidateRead(
        id=candidate.id,
        user_id=candidate.user_id,
        first_name=candidate.first_name,
        last_name=candidate.last_name,
        location=candidate.location,
        years_exp=candidate.years_exp,
        bio=candidate.bio,
        resume_url=candidate.resume_url,
        desired_salary=candidate.desired_salary,
        country=getattr(candidate, "country", None),
        tel=getattr(candidate, "tel", None),
        img_path=getattr(candidate, "img_path", None),
        prefers_remote=getattr(candidate, "prefers_remote", None),
        seniority=getattr(candidate, "seniority", None),
        email=email,
        role=role_name,
        skills=candidate.skills,
    )

async def candidate_update(id: int, candidate_update: CandidateUpdate, db: AsyncSession) -> CandidateRead:
    user = await get_user(id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await db.execute(
        select(Candidate)
        .where(Candidate.user_id == user.id)
        .options(selectinload(Candidate.skills))
    )
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found for this user")

    data = candidate_update.model_dump(exclude_unset=True)

    for field in (
        "first_name", "last_name", "location", "years_exp",
        "bio", "resume_url", "desired_salary"
    ):
        if field in data:
            setattr(candidate, field, data[field])


    if "skills" in data and data["skills"] is not None:
        skill_ids: List[int] = data["skills"]
        skills_q = await db.execute(select(Skill).where(Skill.id.in_(skill_ids)))
        skills = list(skills_q.scalars().all())
        candidate.skills.clear()
        candidate.skills.extend(skills)   

    if "email" in data and data["email"]:
        user.email = data["email"]

    await db.commit()
    await db.refresh(candidate)
    await db.refresh(user)

    return CandidateRead(
        id=candidate.id,
        user_id=candidate.user_id,
        first_name=candidate.first_name,
        last_name=candidate.last_name,
        location=candidate.location,
        years_exp=candidate.years_exp,
        bio=candidate.bio,
        resume_url=candidate.resume_url,
        desired_salary=candidate.desired_salary,
        country=getattr(candidate, "country", None),
        tel=getattr(candidate, "tel", None),
        img_path=getattr(candidate, "img_path", None),
        prefers_remote=getattr(candidate, "prefers_remote", None),
        seniority=getattr(candidate, "seniority", None),
        email=user.email,
        role=str(getattr(user.role, "name", None)),
        skills=candidate.skills, # type: ignore
    )
