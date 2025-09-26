from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import EmployerRead
from app.services.employers import list_employers, get_employer

router = APIRouter()

@router.get("/", response_model=list[EmployerRead])
async def get_employers(db: AsyncSession = Depends(get_db)):
    return await list_employers(db)

@router.get("/{id}", response_model=EmployerRead)
async def get_employer_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await get_employer(id, db)

