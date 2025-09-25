from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from .role import RoleRead

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    hashed_password: str
    role_id: int

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    hashed_password: Optional[str] = None
    role_id: Optional[int] = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    role: RoleRead  
    model_config = {"from_attributes": True}

class AdminRead(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}
