from typing import  Optional
from pydantic import BaseModel, Field


class SkillBase(BaseModel):
    name: str = Field(..., max_length=100)

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)

class SkillRead(SkillBase):
    model_config = {"from_attributes": True}
    id: int