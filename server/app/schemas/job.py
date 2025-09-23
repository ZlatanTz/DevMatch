from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from .skill import SkillRead 
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
    skills: List[int] = Field(default_factory=list)  

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
    skills: Optional[List[int]] = None  

class JobRead(JobBase):
    id: int
    employer_id: int
    created_at: datetime

    skills: List[SkillRead] = Field(default_factory=list)
    model_config = {"from_attributes": True}


class JobListQuery(BaseModel):

    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    sort_by: Literal["created_at", "max_salary"] = "created_at"
    sort_dir: Literal["asc", "desc"] = "desc"  

 
    title_contains: Optional[str] = None          
    is_remote: Optional[bool] = None              
    seniorities: Optional[List[str]] = None       
    skill_ids_any: Optional[List[int]] = None     