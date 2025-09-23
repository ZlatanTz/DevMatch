from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import JobRead
from app.services.jobs import list_jobs

router = APIRouter()

@router.get("/", response_model=list[JobRead])
async def get_roles(db: AsyncSession = Depends(get_db)):
    return await list_jobs(db)

@router.get("/{id}", response_model=list[JobRead])
async def get_roles(id:int, db: AsyncSession = Depends(get_db)):
    return await list_jobs(db)

