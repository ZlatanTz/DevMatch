from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import CandidateRead, CandidateUpdate
from app.services.candidates import list_candidates, get_candidate, candidate_update

router = APIRouter()

@router.get("/", response_model=list[CandidateRead])
async def get_candidates(db: AsyncSession = Depends(get_db)):
    return await list_candidates(db)

@router.get("/{id}", response_model=CandidateRead)
async def get_candidate_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await get_candidate(id, db)

@router.put("/{id}", response_model=CandidateRead)
async def update_candidate_by_id(id: int, candidate_change: CandidateUpdate, db: AsyncSession = Depends(get_db)):
    return await candidate_update(id, candidate_change, db)