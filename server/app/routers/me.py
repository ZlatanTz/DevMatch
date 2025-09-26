from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.user import UserRead, UserUpdate
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=UserRead)
async def update_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user

