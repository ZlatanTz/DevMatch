from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Candidate, User, Role
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.candidate import CandidateUpdate, CandidateRead
from ..services.users import get_user
from fastapi import HTTPException
from app.models import Skill
from typing import List, cast

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
        select(Candidate, User.email, Role.name)
        .join(User, Candidate.user_id == User.id)
        .join(Role, User.role_id == Role.id)
        .where(Candidate.user_id == user_id)
    )
    
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate, email, role_name = row
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
        "role": role_name,   # now returns string from Roles table
        "skills": candidate.skills
    }

async def candidate_update(id: int, candidate_update: CandidateUpdate, db: AsyncSession):
    # Get user
    user = await get_user(id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get candidate
    result = await db.execute(select(Candidate).where(Candidate.user_id == user.id))
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found for this user")

    # Only update fields that are provided
    update_data = candidate_update.dict(exclude_unset=True)

    if "first_name" in update_data:
        candidate.first_name = update_data["first_name"]
    if "last_name" in update_data:
        candidate.last_name = update_data["last_name"]
    if "location" in update_data:
        candidate.location = update_data["location"]
    if "years_exp" in update_data:
        candidate.years_exp = update_data["years_exp"]
    if "bio" in update_data:
        candidate.bio = update_data["bio"]
    if "resume_url" in update_data:
        candidate.resume_url = update_data["resume_url"]
    if "desired_salary" in update_data:
        candidate.desired_salary = update_data["desired_salary"]

    # Handle skills properly
    if "skills" in update_data and update_data["skills"] is not None:
        skill_ids = update_data["skills"]
        result = await db.execute(select(Skill).where(Skill.id.in_(skill_ids)))
        candidate.skills = result.scalars().all()  # assign Skill objects

    # Update email on the related user
    if "email" in update_data:
        user.email = update_data["email"]

    await db.commit()
    await db.refresh(candidate)
    await db.refresh(user)

    # Build response
    return CandidateRead(
        id=candidate.id,
        user_id=candidate.user_id,
        first_name=candidate.first_name,
        last_name=candidate.last_name,
        email=user.email,
        location=candidate.location,
        years_exp=candidate.years_exp,
        bio=candidate.bio,
        resume_url=candidate.resume_url,
        desired_salary=candidate.desired_salary,
        skills=candidate.skills,  # now properly Skill objects
        role=str(user.role.name)
    )