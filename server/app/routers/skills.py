from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import SkillRead
from app.services.skills import list_skills

router = APIRouter()

@router.get("/", response_model=list[SkillRead])
async def get_skills(db: AsyncSession = Depends(get_db)):
    return await list_skills(db)