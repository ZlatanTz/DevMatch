from datetime import datetime
from typing import Optional
from pydantic import AnyUrl, BaseModel, EmailStr, Field
from app.schemas.role import RoleRead
from app.schemas.candidate import CandidateBase, CandidateRead
from app.schemas.employer import EmployerBase, EmployerRead

class UserBase(BaseModel):
    email: EmailStr

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    hashed_password: Optional[str] = None
    role_id: Optional[int] = None

class UserRead(BaseModel):
    id: int
    email: str
    is_active: bool
    is_suspended: bool
    created_at: datetime
    updated_at: datetime
    role: RoleRead
    is_verified: bool

class ExtendedUserRead(UserRead):
    employer: EmployerRead | None = None
    candidate: CandidateRead | None = None

class UserActiveStatus(BaseModel):
    is_active: bool

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

class ResetPasswordRequest(BaseModel):
    old_password: str
    new_password: str

class EmployerLogoUpdate(BaseModel):
    company_logo: AnyUrl = Field(..., description="Public URL to employer's company logo")

class CandidateFilesUpdate(BaseModel):
    img_path: Optional[AnyUrl] = Field(None, description="Public URL to candidate profile image")
    resume_url: Optional[AnyUrl] = Field(None, description="Public URL to candidate resume (PDF)")
    
class UserSuspendStatus(BaseModel):
    is_suspended: bool
