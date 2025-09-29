from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.skill import Skill
from app.schemas.user import CandidateFilesUpdate, EmployerLogoUpdate, ResetPasswordRequest, UserActiveStatus
from app.schemas.candidate import CandidateUpdate
from app.schemas.employer import EmployerUpdate
from app.utils.auth import hash_password, verify_password


async def read_me(current_user: User) -> User:
    return current_user


async def update_user(
    db: AsyncSession,
    current_user: User,
    candidate_data: Optional[CandidateUpdate],
    employer_data: Optional[EmployerUpdate],
) -> User:
    if current_user.role.name == "candidate":
        if not candidate_data:
            raise HTTPException(status_code=400, detail="Candidate data required")
        candidate = current_user.candidate

        for field, value in candidate_data.model_dump(exclude_unset=True).items():
            if field == "skills":
                continue
            setattr(candidate, field, value)

        if candidate_data.skills is not None:
            result = await db.execute(
                select(Skill).where(Skill.id.in_(candidate_data.skills))
            )
            skill_objs = result.scalars().all()
            candidate.skills = skill_objs

        await db.commit()
        await db.refresh(candidate)
        return current_user

    elif current_user.role.name == "employer":
        if not employer_data:
            raise HTTPException(status_code=400, detail="Employer data required")
        employer = current_user.employer

        for field, value in employer_data.model_dump(exclude_unset=True).items():
            setattr(employer, field, value)

        await db.commit()
        await db.refresh(employer)
        return current_user

    else:
        raise HTTPException(status_code=403, detail="Role not allowed for update")

async def reset_password(
    db: AsyncSession,
    current_user: User,
    data: ResetPasswordRequest,
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    current_user.hashed_password = hash_password(data.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}


async def set_active_status(
    db: AsyncSession,
    current_user: User,
    data: UserActiveStatus,
):
    current_user.is_active = data.is_active
    await db.commit()
    await db.refresh(current_user)
    return {"is_active": current_user.is_active}

async def update_employer_logo(
    db: AsyncSession,
    current_user: User,
    data: EmployerLogoUpdate,
) -> User:
    if current_user.role.name != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can update company_logo")

    employer = current_user.employer
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")

    employer.company_logo = str(data.company_logo)
    await db.commit()
    await db.refresh(employer)
    return current_user

async def update_candidate_files(
    db: AsyncSession,
    current_user: User,
    data: CandidateFilesUpdate,
) -> User:
    if current_user.role.name != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can update files")

    candidate = current_user.candidate
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    payload = data.model_dump(exclude_unset=True)
    if not payload:
        raise HTTPException(status_code=400, detail="No fields provided")

    if "img_path" in payload:
        candidate.img_path = str(payload["img_path"])
    if "resume_url" in payload:
        candidate.resume_url = str(payload["resume_url"])

    await db.commit()
    await db.refresh(candidate)
    return current_user
