from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.user import ResetPasswordRequest, UserActiveStatus, UserRead, ExtendedUserRead
from app.schemas.candidate import CandidateUpdate
from app.schemas.employer import EmployerUpdate
from app.models.user import User
from app.utils.auth import get_current_user
from app.services import me as me_service

router = APIRouter()

@router.get("", response_model=ExtendedUserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return await me_service.read_me(current_user)


@router.put("", response_model=ExtendedUserRead)
async def update_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    candidate_data: Optional[CandidateUpdate] = None,
    employer_data: Optional[EmployerUpdate] = None,
):
    return await me_service.update_user(db, current_user, candidate_data, employer_data)


@router.put("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await me_service.reset_password(db, current_user, data)


@router.put("/active", response_model=UserActiveStatus)
async def set_active_status(
    data: UserActiveStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await me_service.set_active_status(db, current_user, data)
