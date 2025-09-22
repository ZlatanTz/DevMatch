from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    role: str = Field(..., max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    role: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None

class UserRead(UserBase):
    model_config = {"from_attributes": True}
    id: int


class AdminRead(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    name: str
