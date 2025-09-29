from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from .skill import SkillRead 
from fastapi import Query
from .employer import EmployerRead
from app.enums.job_status import JobStatus

class JobBase(BaseModel):
    title: str = Field(..., max_length=255)
    location: Optional[str] = None
    employment_type: Optional[str] = None
    seniority: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    is_remote: bool = False
    status: JobStatus = JobStatus.open
    description: Optional[str] = None
    company_description: Optional[str] = None
    benefits: Optional[List[str]] = None



class JobCreate(JobBase):
    status: Literal[JobStatus.open] = JobStatus.open
    employer_id: int
    skills: List[int] = Field(default_factory=list)  

class JobUpdate(BaseModel):
    title: Optional[str] = None
    # company: Optional[str] = None
    # company_img: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    seniority: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    is_remote: Optional[bool] = None
    status: Optional[JobStatus] = None
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

class JobReadDetailed(JobRead):
    employer: EmployerRead
    model_config = {"from_attributes": True, "populate_by_name": True}

    def employer_name(self):
        emp = self.employer
        if not emp:
            return None
        return getattr(emp, "name", None) or getattr(emp, "company_name", None)
class JobListQuery(BaseModel):

    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    sort_by: Literal["created_at", "max_salary"] = "created_at"
    sort_dir: Literal["asc", "desc"] = "desc"  

 
    title_contains: Optional[str] = None          
    is_remote: Optional[bool] = None              
    seniorities: Optional[List[str]] = None       
    skill_ids_any: Optional[List[int]] = None 


def job_list_query(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: Literal["created_at", "max_salary"] = Query("created_at"),
    sort_dir: Literal["asc", "desc"] = Query("desc"),
    title_contains: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),

    seniorities: Optional[List[str]] = Query(None),
    skill_ids_any: Optional[List[int]] = Query(None),
) -> JobListQuery:
    return JobListQuery(
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_dir=sort_dir,
        title_contains=title_contains,
        is_remote=is_remote,
        seniorities=seniorities,
        skill_ids_any=skill_ids_any,
    )
