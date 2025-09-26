from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.schemas.auth import RegisterCandidate, TokenResponse, MessageRegisterResponse
from app.services.auth import login_user, register_new_candidate, register_new_employer
from app.schemas.employer import EmployerRegister
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from app.utils.auth import create_access_token
from app.core.config import settings
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.ALGORITHM

router = APIRouter()

@router.post("/register-candidate", status_code=status.HTTP_201_CREATED, response_model=MessageRegisterResponse)
async def register_candidate(data: RegisterCandidate, db: AsyncSession = Depends(get_db)):
    await register_new_candidate(db, data)
    return MessageRegisterResponse(message="Candidate created successfully")

@router.post("/register-employer", status_code=status.HTTP_201_CREATED, response_model=MessageRegisterResponse)
async def register_employer(data: EmployerRegister, db: AsyncSession = Depends(get_db)):
    await register_new_employer(db, data)
    return MessageRegisterResponse(message="Employer created successfully")

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(db, form_data.username, form_data.password)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") != "refresh_token":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({"sub": str(user_id)})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }