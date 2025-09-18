from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    employment_type: str
    seniority: str
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    is_remote: bool
    status: str
    description: str
    company_description: Optional[str] = None

class JobCreate(JobBase):
    pass 

class JobOut(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
