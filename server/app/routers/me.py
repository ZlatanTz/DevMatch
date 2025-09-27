from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.user import ResetPasswordRequest, UserRead, UserUpdate
from app.models.user import User
from app.utils.auth import get_current_user, hash_password, verify_password
from app.schemas.candidate import CandidateUpdate
from app.schemas.employer import EmployerUpdate
from app.models.skill import Skill

router = APIRouter()

@router.get("", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=UserRead)
async def update_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    candidate_data: Optional[CandidateUpdate] = None,
    employer_data: Optional[EmployerUpdate] = None,
):
    if current_user.role.name == "candidate":
        if not candidate_data:
            raise HTTPException(status_code=400, detail="Candidate data required")
        candidate = current_user.candidate
        for field, value in candidate_data.model_dump(exclude_unset=True).items():
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

@router.put("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    current_user.hashed_password = hash_password(data.new_password)

    await db.commit()
    return {"message": "Password updated successfully"}
