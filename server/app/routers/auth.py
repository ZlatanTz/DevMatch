from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.auth import LoginRequest, RegisterCandidate
from app.services.auth import login_user, register_new_candidate, register_new_employer
from app.schemas.employer import EmployerRead, EmployerRegister

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register-candidate", status_code=status.HTTP_201_CREATED)
async def register_candidate(data: RegisterCandidate, db: AsyncSession = Depends(get_db)):
    await register_new_candidate(db, data)
    return {"message": "Candidate created successfully"}

@router.post("/register-employer", status_code=201)
async def register_employer(data: EmployerRegister, db: AsyncSession = Depends(get_db)):
    await register_new_employer(db, data)
    return {"message": "Employer created successfully"}

@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await login_user(db, data.email, data.password)