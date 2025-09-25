from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import User, Candidate
from app.utils.auth import hash_password
from app.models.skill import Skill
from app.schemas.employer import EmployerRegister
from app.models.employer import Employer

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def register_new_candidate(db: AsyncSession, data):
    existing_user = await get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role_id=3,
        is_active=True,
        is_suspended=False,
    )
    db.add(new_user)
    await db.flush()

    new_candidate = Candidate(
        user_id=new_user.id,
        first_name=data.candidate.first_name,
        last_name=data.candidate.last_name,
        location=data.candidate.location,
        years_exp=data.candidate.years_exp,
        bio=data.candidate.bio,
        resume_url=data.candidate.resume_url,
        desired_salary=data.candidate.desired_salary,
        country=data.candidate.country,
        tel=data.candidate.tel,
        img_path=data.candidate.img_path,
    )
    db.add(new_candidate)
    
    if data.candidate.skills:
        result = await db.execute(select(Skill).where(Skill.id.in_(data.candidate.skills)))
        skill_objs = result.scalars().all()
        new_candidate.skills.extend(skill_objs)

    await db.commit()
    await db.refresh(new_candidate)

    return new_candidate


async def register_new_employer(db: AsyncSession, data: EmployerRegister):
    existing_user = await get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role_id=2,
        is_active=True,
        is_suspended=False,
    )
    db.add(new_user)
    await db.flush()

    new_employer = Employer(
        user_id=new_user.id,
        company_name=data.employer.company_name,
        website=data.employer.website,
        about=data.employer.about,
        location=data.employer.location,
        country=data.employer.country,
        tel=data.employer.tel,
    )
    db.add(new_employer)

    await db.commit()
    await db.refresh(new_employer)

    return new_employer
