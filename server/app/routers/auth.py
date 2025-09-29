from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.auth import RegisterCandidate, TokenResponse, MessageRegisterResponse
from app.services.auth import login_user, register_new_candidate, register_new_employer
from app.schemas.employer import EmployerRegister
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.ALGORITHM

router = APIRouter()

@router.post("/register-candidate", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def register_candidate(data: RegisterCandidate, db: AsyncSession = Depends(get_db)):
    return await register_new_candidate(db, data)


@router.post("/register-employer", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def register_employer(data: EmployerRegister, db: AsyncSession = Depends(get_db)):
    return await register_new_employer(db, data)
    

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(db, form_data.username, form_data.password)
