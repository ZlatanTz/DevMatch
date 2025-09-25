from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.auth import RegisterCandidate
from app.services.auth import register_new_candidate

router = APIRouter()

@router.post("/register-candidate", status_code=status.HTTP_201_CREATED)
async def register_candidate(data: RegisterCandidate, db: AsyncSession = Depends(get_db)):
    await register_new_candidate(db, data)
    return {"message": "Candidate created successfully"}