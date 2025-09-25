from pydantic import BaseModel, EmailStr
from app.schemas.candidate import CandidateCreate

class RegisterCandidate(BaseModel):
    email: EmailStr
    password: str
    candidate: CandidateCreate

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

