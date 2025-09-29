from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.enums.application_status import ApplicationStatus


class ApplicationBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    year_of_birth: int
    phone: str
    location: str
    years_experience: int
    seniority_level: str
    skills: List[str]
    cover_letter: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    cv_path: str 


class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None

class ApplicationOut(ApplicationBase):
    id: int
    candidate_id: int
    job_id: int
    cv_path: str
    status: ApplicationStatus
    created_at: datetime
    
    model_config = {"from_attributes": True}
    
