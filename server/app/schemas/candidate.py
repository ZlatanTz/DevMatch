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

class CandidateCreate(CandidateBase):
    user_id: int
    skills: Optional[List[int]] = [] 

class CandidateUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    desired_salary: Optional[int] = None
    skills: Optional[List[int]] = None  #

class CandidateRead(CandidateBase):
    model_config = {"from_attributes": True}
    id: int
    user_id: int
    email: str
    skills: List[SkillRead] = []