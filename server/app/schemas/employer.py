from typing import  Optional
from pydantic import BaseModel, Field


class EmployerBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    tel: Optional[str] = None

class EmployerCreate(EmployerBase):
    user_id: int

class EmployerUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    tel: Optional[str] = None

class EmployerRead(EmployerBase):
    model_config = {"from_attributes": True}
    id: int
    user_id: int