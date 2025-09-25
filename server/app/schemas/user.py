from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.role import RoleRead
from app.schemas.candidate import CandidateBase
from app.schemas.employer import EmployerBase

class UserBase(BaseModel):
    email: EmailStr

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_suspended: Optional[bool] = None

class UserRead(UserBase):
    model_config = {"from_attributes": True}
    id: int
    is_active: bool
    is_suspended: bool
    created_at: datetime
    updated_at: datetime
    role: RoleRead

class UserCreate(BaseModel):
    password: str
    role_id: int
    candidate: CandidateBase | None = None
    employer: EmployerBase | None = None
