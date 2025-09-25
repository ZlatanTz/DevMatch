from pydantic import BaseModel, EmailStr
from app.schemas.candidate import CandidateCreate

class RegisterCandidate(BaseModel):
    email: EmailStr
    password: str
    candidate: CandidateCreate