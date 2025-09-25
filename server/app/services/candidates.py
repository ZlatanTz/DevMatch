from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Candidate, User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.candidate import CandidateUpdate
from ..services.users import get_user
from fastapi import HTTPException
from app.models import Skill


async def list_candidates(db: AsyncSession):
    result = await db.execute(
        select(
            Candidate,
            User.email
        ).join(User, Candidate.user_id == User.id)
    )
    
    candidates_with_email = []
    for candidate, email in result.all():
        candidates_with_email.append({
            "id": candidate.id,
            "first_name": candidate.first_name,
            "last_name": candidate.last_name,
            "location": candidate.location,
            "years_exp": candidate.years_exp,
            "bio": candidate.bio,
            "resume_url": candidate.resume_url,
            "desired_salary": candidate.desired_salary,
            "user_id": candidate.user_id,
            "email": email,
            "skills": candidate.skills
        })
    
    return candidates_with_email

async def get_candidate(user_id: int, db: AsyncSession):

    result = await db.execute(
        select(Candidate, User.email)
        .join(User, Candidate.user_id == User.id)
        .where(Candidate.user_id == user_id)
    )
    
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate, email = row
    return {
        "id": candidate.id,
        "first_name": candidate.first_name,
        "last_name": candidate.last_name,
        "location": candidate.location,
        "years_exp": candidate.years_exp,
        "bio": candidate.bio,
        "resume_url": candidate.resume_url,
        "desired_salary": candidate.desired_salary,
        "user_id": candidate.user_id,
        "email": email,
        "skills": candidate.skills
    }

async def candidate_update(id: int, candidate_update: CandidateUpdate, db: AsyncSession):
    user = await get_user(id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await db.execute(select(Candidate).where(Candidate.user_id == user.id))
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found for this user")

    update_data = candidate_update.dict(exclude_unset=True)

    if "skills" in update_data and update_data["skills"] is not None:
        skill_ids = update_data.pop("skills") 
        result = await db.execute(select(Skill).where(Skill.id.in_(skill_ids)))
        candidate.skills = result.scalars().all()

    for key, value in update_data.items():
        setattr(candidate, key, value)

    await db.commit()
    await db.refresh(candidate)
    return candidate