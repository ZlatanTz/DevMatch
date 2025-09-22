from typing import  Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.skill import SkillRead

class JobBase(BaseModel):
    title: str = Field(..., max_length=255)
    company: Optional[str] = None
    company_img: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    seniority: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    is_remote: bool = False
    status: str = "open"
    description: Optional[str] = None
    company_description: Optional[str] = None
    benefits: Optional[List[str]] = None

class JobCreate(JobBase):
    employer_id: int
    skills: Optional[List[int]] = []  # list of skill IDs

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    company_img: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    seniority: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    is_remote: Optional[bool] = None
    status: Optional[str] = None
    description: Optional[str] = None
    company_description: Optional[str] = None
    benefits: Optional[List[str]] = None
    skills: Optional[List[int]] = None  # replace skills

class JobRead(JobBase):
    model_config = {"from_attributes": True}
    id: int
    employer_id: int
    created_at: datetime
    skills: List[SkillRead] = []