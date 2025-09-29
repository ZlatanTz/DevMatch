from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import User, Candidate
from app.utils.auth import ROLE_MAP, create_access_token, get_user_by_email, hash_password, verify_password
from app.models.skill import Skill
from app.schemas.employer import EmployerRegister
from app.models.employer import Employer
from sqlalchemy.orm import selectinload
from app.schemas.user import UserWithProfile

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
        prefers_remote=data.candidate.prefers_remote,
        seniority=data.candidate.seniority,
    )   
    db.add(new_candidate)
    
    if data.candidate.skills:
        result = await db.execute(select(Skill).where(Skill.id.in_(data.candidate.skills)))
        skill_objs = result.scalars().all()
        new_candidate.skills.extend(skill_objs)

    await db.commit()
    await db.refresh(new_candidate)

    access_token = create_access_token({"sub": str(new_user.id), "role": new_user.role_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


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
        company_logo=data.employer.company_logo
    )
    db.add(new_employer)

    await db.commit()
    await db.refresh(new_employer)

    access_token = create_access_token({"sub": str(new_user.id), "role": new_user.role_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }



async def login_user(db: AsyncSession, email: str, password: str):
    result = await db.execute(
        select(User)
        .options(selectinload(User.candidate), selectinload(User.employer))
        .where(User.email == email)
    )
    user = result.scalars().first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": str(user.id), "role": user.role_id})

    user_dict = user.__dict__.copy()
    user_dict["role"] = ROLE_MAP.get(user.role_id, "unknown")

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

