from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.role import RoleRead
from app.schemas.candidate import CandidateBase
from app.schemas.employer import EmployerBase

class UserBase(BaseModel):
    role: str = Field(..., max_length=50)
    email: EmailStr

class UserUpdate(BaseModel):
    role: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None

class UserRead(UserBase):
    id: int
    is_active: bool
    is_suspended: bool
    created_at: datetime
    updated_at: datetime
    role: RoleRead
    is_verified: bool

class UserCreate(BaseModel):
    password: str
    role_id: int
    candidate: CandidateBase | None = None
    employer: EmployerBase | None = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role_id: int
    role: str
    is_active: bool
    is_suspended: bool
    is_verified: bool
    model_config = {"from_attributes": True}

class CandidateRead(CandidateBase):
    id: int
    model_config = {"from_attributes": True}

class EmployerRead(EmployerBase):
    id: int
    model_config = {"from_attributes": True}

class UserWithProfile(UserOut):
    candidate: Optional[CandidateRead] = None
    employer: Optional[EmployerRead] = None
