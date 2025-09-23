from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import RoleRead
from app.services.roles import list_roles

router = APIRouter()

@router.get("/", response_model=list[RoleRead])
async def get_roles(db: AsyncSession = Depends(get_db)):
    return await list_roles(db)