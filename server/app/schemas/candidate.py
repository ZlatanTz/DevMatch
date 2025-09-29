from typing import  Optional, List
from pydantic import BaseModel, Field
from app.schemas.skill import SkillRead

class CandidateBase(BaseModel):
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    desired_salary: Optional[int] = None
    country: Optional[str] = None
    tel: Optional[str] = None
    img_path: Optional[str] = None
    prefers_remote: Optional[bool] = None
    seniority: Optional[str] = None

class CandidateCreate(CandidateBase):
    skills: List[int] = Field(default_factory=list)  



class CandidateRead(CandidateBase):
    model_config = {"from_attributes": True}
    id: int
    user_id: int
    email: Optional[str] = None
    role: Optional[str] = None
    skills: List[SkillRead] = Field(default_factory=list)

class CandidateUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    location: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    desired_salary: Optional[int] = None
    country: Optional[str] = None
    tel: Optional[str] = None
    img_path: Optional[str] = None
    prefers_remote: Optional[bool] = None
    skills: Optional[List[int]] = None
    seniority: Optional[str] = None

