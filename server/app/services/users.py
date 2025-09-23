from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.user import UserCreate, UserUpdate

async def list_users(db: AsyncSession):
    result = await db.execute(
        select(User).options(selectinload(User.role))
    )
    return result.scalars().all()

async def get_user(id: int, db: AsyncSession):
    result = await db.execute(
        select(User)
        .options(selectinload(User.role))
        .where(User.id == id)
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

async def create_user(user_create: UserCreate, db: AsyncSession):
    user = User(
        email=user_create.email,
        hashed_password=user_create.hashed_password,  # kasnije staviti hashing
        role_id=user_create.role_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def user_update(id: int, user_update: UserUpdate, db: AsyncSession):
    user = await get_user(id, db)
    
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    return user

async def delete_user(id: int, db: AsyncSession):
    user = await get_user(id, db)

    await db.delete(user)
    await db.commit()

    return {"detail": f"User {id} deleted successfully"}

# GET user by email
async def get_user_by_email(email: str, db: AsyncSession):
    result = await db.execute(
        select(User).options(selectinload(User.role)).where(User.email == email)
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# UPDATE user by email
async def user_update_by_email(email: str, user_update: UserUpdate, db: AsyncSession):
    user = await get_user_by_email(email, db)
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user


# DELETE user by email
async def delete_user_by_email(email: str, db: AsyncSession):
    user = await get_user_by_email(email, db)
    await db.delete(user)
    await db.commit()
    return {"detail": f"User {email} deleted successfully"}