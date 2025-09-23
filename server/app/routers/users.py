from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import UserRead, UserCreate, UserUpdate
from app.services.users import list_users, get_user, create_user, user_update, delete_user, get_user_by_email, user_update_by_email, delete_user_by_email

router = APIRouter()

# # GET user by email
# @router.get("/email/{email}", response_model=UserRead)
# async def get_user_by_email_route(email: str, db: AsyncSession = Depends(get_db)):
#     return await get_user_by_email(email, db)


# # UPDATE user by email
# @router.put("/email/{email}", response_model=UserRead)
# async def update_user_by_email_route(email: str, user_change: UserUpdate, db: AsyncSession = Depends(get_db)):
#     return await user_update_by_email(email, user_change, db)


# # DELETE user by email
# @router.delete("/email/{email}")
# async def delete_user_by_email_route(email: str, db: AsyncSession = Depends(get_db)):
#     return await delete_user_by_email(email, db)


# GET user by email
@router.get("/by-email", response_model=UserRead)
async def get_user_by_email_route(email: str, db: AsyncSession = Depends(get_db)):
    return await get_user_by_email(email, db)


# UPDATE user by email
@router.put("/by-email", response_model=UserRead)
async def update_user_by_email_route(email: str, user_change: UserUpdate, db: AsyncSession = Depends(get_db)):
    return await user_update_by_email(email, user_change, db)


# DELETE user by email
@router.delete("/by-email")
async def delete_user_by_email_route(email: str, db: AsyncSession = Depends(get_db)):
    return await delete_user_by_email(email, db)


@router.get("/", response_model=list[UserRead])
async def get_users(db: AsyncSession = Depends(get_db)):
    return await list_users(db)

@router.post("/", response_model=UserRead)
async def create_new_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    return await create_user(user_create, db)

@router.get("/{id}", response_model=UserRead)
async def get_user_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await get_user(id, db)

@router.put("/{id}", response_model=UserRead)
async def update_user_by_id(id: int, user_change: UserUpdate, db: AsyncSession = Depends(get_db)):
    return await user_update(id, user_change, db)

@router.delete("/{id}")
async def delete_user_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await delete_user(id, db)

