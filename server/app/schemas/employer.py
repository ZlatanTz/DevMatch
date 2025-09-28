from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class EmployerRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

    employer: "EmployerBase"

class EmployerBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    tel: Optional[str] = None
    company_logo: Optional[str] = None

class EmployerRead(EmployerBase):
    id: int
    user_id: int

    name: Optional[str] = Field(default=None, alias="company_name")

    model_config = {"from_attributes": True, "populate_by_name": True}

class EmployerUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    tel: Optional[str] = None
    company_logo: Optional[str] = None
