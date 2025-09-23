from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.role import RoleRead

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    hashed_password: str
    role_id: int

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