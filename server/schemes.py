from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class SkillBase(BaseModel):
    name: str = Field(..., max_length=100)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)


class SkillRead(SkillBase):
    model_config = {"from_attributes": True}
    id: int


class UserBase(BaseModel):
    role: str = Field(..., max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    role: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    suspended: Optional[bool] = None
    verified: Optional[bool] = None


class UserRead(UserBase):
    model_config = {"from_attributes": True}
    id: int
    suspended: bool
    verified: bool



class CandidateBase(BaseModel):
    first_name: str = Field(..., max_length=255)
    last_name: str = Field(..., max_length=255)
    location: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    desired_salary: Optional[int] = None


class CandidateCreate(CandidateBase):
    user_id: int
    skills: Optional[List[int]] = []  


class CandidateUpdate(BaseModel):
    first_name: str = Field(..., max_length=255)
    last_name: str = Field(..., max_length=255)
    location: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    desired_salary: Optional[int] = None
    skills: Optional[List[int]] = None  


class CandidateRead(CandidateBase):
    model_config = {"from_attributes": True}
    id: int
    user_id: int
    skills: List[SkillRead] = []


class EmployerBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    verified: bool = False
    country: Optional[str] = None
    tel: Optional[str] = None


class EmployerCreate(EmployerBase):
    user_id: int


class EmployerUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    verified: Optional[bool] = None
    country: Optional[str] = None
    tel: Optional[str] = None


class EmployerRead(EmployerBase):
    model_config = {"from_attributes": True}
    id: int
    user_id: int

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
    skills: Optional[List[int]] = [] 


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
    model_config = {"from_attributes": True}
    id: int
    employer_id: int
    created_at: datetime
    skills: List[SkillRead] = []
